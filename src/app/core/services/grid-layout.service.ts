import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { GridState } from 'ag-grid-community';
import { Observable, catchError, map, of, tap } from 'rxjs';

export interface MultiGridLayoutState {
  grids: Record<string, GridState>;
}

export type GridLayoutState = GridState | MultiGridLayoutState;

export interface NamedGridLayout {
  name: string;
  state: GridLayoutState;
  updatedAt: string;
}

export interface GridLayoutCollection {
  key: string;
  activeName: string;
  layouts: NamedGridLayout[];
}

interface GridLayoutCollectionResponse {
  key?: string;
  activeName?: string | null;
  layouts?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class GridLayoutService {
  private readonly http = inject(HttpClient);
  private readonly reservedLayoutNames = new Set(['default']);
  private readonly layoutCollections = new Map<string, GridLayoutCollection>();

  loadCollection(key: string): Observable<GridLayoutCollection> {
    return this.http.get<GridLayoutCollectionResponse>(this.collectionUrl(key)).pipe(
      map(response => this.normalizeCollection(key, response)),
      tap(collection => this.layoutCollections.set(key, collection)),
      catchError(() => of(this.layoutCollections.get(key) ?? this.emptyCollection(key))),
    );
  }

  hasLayout(key: string): boolean {
    const activeLayoutName = this.activeName(key);
    const state = activeLayoutName ? this.loadNamed(key, activeLayoutName) : undefined;
    return state !== undefined;
  }

  names(key: string): string[] {
    return this.layoutsSnapshot(key).map(layout => layout.name);
  }

  activeName(key: string): string {
    return this.layoutCollections.get(key)?.activeName ?? '';
  }

  setActiveName(key: string, name: string): Observable<GridLayoutCollection> {
    const activeName = name.trim();
    const currentCollection = this.layoutCollections.get(key) ?? this.emptyCollection(key);
    const optimisticCollection = { ...currentCollection, activeName };
    this.layoutCollections.set(key, optimisticCollection);

    return this.http.put<GridLayoutCollectionResponse>(`${this.collectionUrl(key)}/active`, { activeName }).pipe(
      map(response => this.normalizeCollection(key, response, optimisticCollection)),
      tap(collection => this.layoutCollections.set(key, collection)),
      catchError(() => of(optimisticCollection)),
    );
  }

  saveNamed(key: string, name: string, state: GridLayoutState): Observable<GridLayoutCollection> {
    const trimmedName = name.trim();
    if (!trimmedName || this.isReservedName(trimmedName)) {
      return of(this.layoutCollections.get(key) ?? this.emptyCollection(key));
    }

    const layouts = this.layoutsSnapshot(key);
    const normalizedName = trimmedName.toLowerCase();
    const nextLayout: NamedGridLayout = {
      name: trimmedName,
      state,
      updatedAt: new Date().toISOString(),
    };
    const nextLayouts = [
      ...layouts.filter(layout => layout.name.trim().toLowerCase() !== normalizedName),
      nextLayout,
    ].sort((left, right) => left.name.localeCompare(right.name));

    const optimisticCollection: GridLayoutCollection = {
      key,
      activeName: trimmedName,
      layouts: nextLayouts,
    };
    this.layoutCollections.set(key, optimisticCollection);

    return this.http.put<GridLayoutCollectionResponse>(
      `${this.collectionUrl(key)}/layouts/${this.encodePathSegment(trimmedName)}`,
      { name: trimmedName, state },
    ).pipe(
      map(response => this.normalizeCollection(key, response, optimisticCollection)),
      tap(collection => this.layoutCollections.set(key, collection)),
      catchError(() => of(optimisticCollection)),
    );
  }

  loadNamed(key: string, name: string): GridLayoutState | undefined {
    const normalizedName = name.trim().toLowerCase();
    return this.layoutsSnapshot(key).find(layout => layout.name.trim().toLowerCase() === normalizedName)?.state;
  }

  deleteNamed(key: string, name: string): Observable<GridLayoutCollection> {
    const normalizedName = name.trim().toLowerCase();
    const currentCollection = this.layoutCollections.get(key) ?? this.emptyCollection(key);
    const activeName = currentCollection.activeName.trim().toLowerCase() === normalizedName ? '' : currentCollection.activeName;
    const optimisticCollection: GridLayoutCollection = {
      key,
      activeName,
      layouts: currentCollection.layouts.filter(layout => layout.name.trim().toLowerCase() !== normalizedName),
    };
    this.layoutCollections.set(key, optimisticCollection);

    return this.http.delete<GridLayoutCollectionResponse>(
      `${this.collectionUrl(key)}/layouts/${this.encodePathSegment(name.trim())}`,
    ).pipe(
      map(response => this.normalizeCollection(key, response, optimisticCollection)),
      tap(collection => this.layoutCollections.set(key, collection)),
      catchError(() => of(optimisticCollection)),
    );
  }

  isReservedName(name: string): boolean {
    return this.reservedLayoutNames.has(name.trim().toLowerCase());
  }

  isMultiGridLayoutState(state: GridLayoutState): state is MultiGridLayoutState {
    return 'grids' in state && typeof state.grids === 'object' && state.grids !== null;
  }

  private layoutsSnapshot(key: string): NamedGridLayout[] {
    return this.layoutCollections.get(key)?.layouts ?? [];
  }

  private normalizeCollection(
    key: string,
    response: GridLayoutCollectionResponse,
    fallback = this.emptyCollection(key),
  ): GridLayoutCollection {
    const layouts = Array.isArray(response.layouts)
      ? response.layouts.filter((layout): layout is NamedGridLayout => {
        const candidate = layout as Partial<NamedGridLayout>;
        return typeof candidate.name === 'string' && candidate.state !== undefined;
      })
      : fallback.layouts;

    return {
      key: response.key ?? fallback.key,
      activeName: response.activeName?.trim() ?? fallback.activeName,
      layouts: [...layouts].sort((left, right) => left.name.localeCompare(right.name)),
    };
  }

  private emptyCollection(key: string): GridLayoutCollection {
    return {
      key,
      activeName: '',
      layouts: [],
    };
  }

  private collectionUrl(key: string): string {
    return `/grid-layouts/${this.encodePathSegment(key)}`;
  }

  private encodePathSegment(value: string): string {
    return encodeURIComponent(value);
  }
}
