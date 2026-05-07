import { Injectable } from '@angular/core';
import type { GridState } from 'ag-grid-community';

export interface NamedGridLayout {
  name: string;
  state: GridState;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class GridLayoutService {
  private readonly storagePrefix = 'slabdashboard.grid-layout.';
  private readonly activePrefix = 'slabdashboard.grid-layout.active.';

  load(key: string): GridState | undefined {
    const activeLayoutName = this.activeName(key);
    if (activeLayoutName) {
      return this.loadNamed(key, activeLayoutName);
    }

    try {
      const savedLayout = localStorage.getItem(this.storageKey(key));
      return savedLayout ? JSON.parse(savedLayout) as GridState : undefined;
    } catch {
      return undefined;
    }
  }

  save(key: string, state: GridState): void {
    const activeLayoutName = this.activeName(key);
    if (activeLayoutName) {
      this.saveNamed(key, activeLayoutName, state);
      return;
    }

    try {
      localStorage.setItem(this.storageKey(key), JSON.stringify(state));
    } catch {
      // Ignore storage failures so grid interaction is never blocked.
    }
  }

  hasLayout(key: string): boolean {
    return this.load(key) !== undefined;
  }

  names(key: string): string[] {
    return this.layouts(key).map(layout => layout.name);
  }

  activeName(key: string): string {
    try {
      return localStorage.getItem(this.activeStorageKey(key)) ?? '';
    } catch {
      return '';
    }
  }

  setActiveName(key: string, name: string): void {
    try {
      if (name) {
        localStorage.setItem(this.activeStorageKey(key), name);
      } else {
        localStorage.removeItem(this.activeStorageKey(key));
      }
    } catch {
      // Ignore storage failures so grid interaction is never blocked.
    }
  }

  saveNamed(key: string, name: string, state: GridState): void {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const layouts = this.layouts(key);
    const nextLayout: NamedGridLayout = {
      name: trimmedName,
      state,
      updatedAt: new Date().toISOString(),
    };
    const nextLayouts = [
      ...layouts.filter(layout => layout.name !== trimmedName),
      nextLayout,
    ].sort((left, right) => left.name.localeCompare(right.name));

    this.persistLayouts(key, nextLayouts);
    this.setActiveName(key, trimmedName);
  }

  loadNamed(key: string, name: string): GridState | undefined {
    return this.layouts(key).find(layout => layout.name === name)?.state;
  }

  deleteNamed(key: string, name: string): void {
    this.persistLayouts(key, this.layouts(key).filter(layout => layout.name !== name));

    if (this.activeName(key) === name) {
      this.setActiveName(key, '');
    }
  }

  private layouts(key: string): NamedGridLayout[] {
    try {
      const savedLayouts = localStorage.getItem(this.layoutsStorageKey(key));
      return savedLayouts ? JSON.parse(savedLayouts) as NamedGridLayout[] : [];
    } catch {
      return [];
    }
  }

  private persistLayouts(key: string, layouts: NamedGridLayout[]): void {
    try {
      localStorage.setItem(this.layoutsStorageKey(key), JSON.stringify(layouts));
    } catch {
      // Ignore storage failures so grid interaction is never blocked.
    }
  }

  private storageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  private layoutsStorageKey(key: string): string {
    return `${this.storageKey(key)}.named`;
  }

  private activeStorageKey(key: string): string {
    return `${this.activePrefix}${key}`;
  }
}
