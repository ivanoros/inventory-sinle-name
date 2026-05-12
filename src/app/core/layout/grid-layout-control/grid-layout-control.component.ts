import { Component, DestroyRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GridApi } from 'ag-grid-community';
import { GridLayoutService, GridLayoutState, MultiGridLayoutState } from '@core/services/grid-layout.service';

export interface GridLayoutTarget {
  key: string;
  gridApi?: GridApi;
}

@Component({
  selector: 'app-grid-layout-control',
  standalone: true,
  templateUrl: './grid-layout-control.component.html',
})
export class GridLayoutControlComponent implements OnChanges, OnDestroy, OnInit {
  @Input({ required: true }) layoutKey = '';
  @Input() gridApi?: GridApi;
  @Input() gridTargets: GridLayoutTarget[] = [];
  @Input() label = 'Layouts:';

  private readonly gridLayout = inject(GridLayoutService);
  private readonly destroyRef = inject(DestroyRef);
  private saveMessageTimer?: ReturnType<typeof setTimeout>;

  readonly layoutNames = signal<string[]>([]);
  readonly layoutDraftName = signal('Default');
  readonly layoutMenuOpen = signal(false);
  readonly layoutSaveMessage = signal('');
  readonly layoutsLoaded = signal(false);
  private lastAutoAppliedLayoutName = '';
  private layoutLoadKey = '';

  ngOnInit(): void {
    this.loadLayouts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layoutKey'] && !changes['layoutKey'].firstChange) {
      this.loadLayouts();
      this.lastAutoAppliedLayoutName = '';
    }

    this.applyActiveLayoutWhenReady();
  }

  ngOnDestroy(): void {
    if (this.saveMessageTimer) {
      clearTimeout(this.saveMessageTimer);
    }
  }

  setLayoutDraftName(event: Event): void {
    this.layoutDraftName.set((event.target as HTMLInputElement).value);
    this.layoutMenuOpen.set(true);
  }

  openLayoutMenu(): void {
    this.layoutMenuOpen.set(true);
  }

  closeLayoutMenuSoon(): void {
    setTimeout(() => this.layoutMenuOpen.set(false));
  }

  chooseLayoutName(layoutName: string): void {
    this.layoutDraftName.set(layoutName);
    this.layoutMenuOpen.set(false);
    this.applyLayout(layoutName);
  }

  saveNamedLayout(): void {
    const state = this.currentLayoutState();
    if (!state) return;

    const layoutName = this.normalizedLayoutName();
    if (!layoutName || this.isReservedLayoutName(layoutName)) return;

    this.gridLayout.saveNamed(this.layoutKey, layoutName, state)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(collection => {
        this.refreshLayoutNames(collection.activeName || layoutName);
        this.showLayoutSaveMessage(layoutName);
      });
  }

  deleteNamedLayout(): void {
    const layoutName = this.normalizedLayoutName();
    if (!layoutName) return;

    this.gridLayout.deleteNamed(this.layoutKey, layoutName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(collection => this.refreshLayoutNames(collection.activeName));
  }

  isReservedLayoutName(layoutName: string): boolean {
    return this.gridLayout.isReservedName(layoutName);
  }

  canDeleteLayoutName(layoutName: string): boolean {
    const normalizedName = layoutName.trim();
    return this.layoutNames().some(name => name === normalizedName);
  }

  private applyLayout(layoutName: string): void {
    if (!this.hasReadyGrids()) return;

    const normalizedName = layoutName.trim();
    if (!normalizedName || this.isReservedLayoutName(normalizedName)) {
      this.applyDefaultLayout();
      return;
    }

    const layoutState = this.gridLayout.loadNamed(this.layoutKey, normalizedName);
    if (!layoutState) return;

    this.applyState(layoutState);
    this.gridLayout.setActiveName(this.layoutKey, normalizedName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(collection => this.refreshLayoutNames(collection.activeName || normalizedName));
  }

  private applyDefaultLayout(): void {
    const targets = this.activeTargets();
    if (targets.length === 0) return;

    targets.forEach(target => {
      target.gridApi?.resetColumnState();
      target.gridApi?.setFilterModel(null);
      requestAnimationFrame(() => target.gridApi?.autoSizeAllColumns(false));
    });
    this.gridLayout.setActiveName(this.layoutKey, '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(collection => this.refreshLayoutNames(collection.activeName));
  }

  private applyActiveLayoutWhenReady(): void {
    const activeLayoutName = this.gridLayout.activeName(this.layoutKey);
    if (
      !this.layoutsLoaded() ||
      !activeLayoutName ||
      activeLayoutName === this.lastAutoAppliedLayoutName ||
      !this.hasReadyGrids()
    ) {
      return;
    }

    const layoutState = this.gridLayout.loadNamed(this.layoutKey, activeLayoutName);
    if (!layoutState) return;

    this.applyState(layoutState);
    this.refreshLayoutNames(activeLayoutName);
    this.lastAutoAppliedLayoutName = activeLayoutName;
  }

  private applyState(state: GridLayoutState): void {
    const targets = this.activeTargets();

    if (this.gridLayout.isMultiGridLayoutState(state)) {
      targets.forEach(target => {
        const targetState = state.grids[target.key];
        if (targetState) {
          target.gridApi?.setState(targetState);
        }
      });
      return;
    }

    if (targets.length === 1) {
      targets[0].gridApi?.setState(state);
    }
  }

  private refreshLayoutNames(activeName: string): void {
    this.layoutNames.set(this.gridLayout.names(this.layoutKey));
    this.layoutDraftName.set(activeName || 'Default');
  }

  private loadLayouts(): void {
    const requestedKey = this.layoutKey;
    this.layoutLoadKey = requestedKey;
    this.layoutsLoaded.set(false);

    this.gridLayout.loadCollection(requestedKey)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(collection => {
        if (this.layoutLoadKey !== requestedKey) return;

        this.layoutsLoaded.set(true);
        this.refreshLayoutNames(collection.activeName);
        this.applyActiveLayoutWhenReady();
      });
  }

  private normalizedLayoutName(): string {
    return this.layoutDraftName().trim();
  }

  private currentLayoutState(): GridLayoutState | undefined {
    const targets = this.activeTargets();
    if (targets.length === 0 || targets.some(target => !target.gridApi)) return undefined;

    if (targets.length === 1) {
      return targets[0].gridApi?.getState();
    }

    return {
      grids: targets.reduce<MultiGridLayoutState['grids']>((states, target) => {
        if (target.gridApi) {
          states[target.key] = target.gridApi.getState();
        }

        return states;
      }, {}),
    };
  }

  private activeTargets(): GridLayoutTarget[] {
    if (this.gridTargets.length > 0) {
      return this.gridTargets;
    }

    return [{ key: this.layoutKey, gridApi: this.gridApi }];
  }

  private hasReadyGrids(): boolean {
    const targets = this.activeTargets();
    return targets.length > 0 && targets.every(target => target.gridApi);
  }

  private showLayoutSaveMessage(layoutName: string): void {
    if (this.saveMessageTimer) {
      clearTimeout(this.saveMessageTimer);
    }

    this.layoutSaveMessage.set(`Saved "${layoutName}"`);
    this.saveMessageTimer = setTimeout(() => this.layoutSaveMessage.set(''), 2500);
  }
}
