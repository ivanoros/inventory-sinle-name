import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { GridLayoutService } from '@core/services/grid-layout.service';

@Component({
  selector: 'app-grid-layout-control',
  standalone: true,
  templateUrl: './grid-layout-control.component.html',
})
export class GridLayoutControlComponent implements OnChanges, OnDestroy, OnInit {
  @Input({ required: true }) layoutKey = '';
  @Input({ required: true }) gridApi?: GridApi;
  @Input() label = 'Layout';

  private readonly gridLayout = inject(GridLayoutService);
  private saveMessageTimer?: ReturnType<typeof setTimeout>;

  readonly layoutNames = signal<string[]>([]);
  readonly layoutDraftName = signal('Default');
  readonly layoutMenuOpen = signal(false);
  readonly layoutSaveMessage = signal('');

  ngOnInit(): void {
    this.refreshLayoutNames(this.gridLayout.activeName(this.layoutKey));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layoutKey'] && !changes['layoutKey'].firstChange) {
      this.refreshLayoutNames(this.gridLayout.activeName(this.layoutKey));
    }
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
    if (!this.gridApi) return;

    const layoutName = this.normalizedLayoutName();
    if (!layoutName || this.isReservedLayoutName(layoutName)) return;

    this.gridLayout.saveNamed(this.layoutKey, layoutName, this.gridApi.getState());
    this.refreshLayoutNames(layoutName);
    this.showLayoutSaveMessage(layoutName);
  }

  deleteNamedLayout(): void {
    const layoutName = this.normalizedLayoutName();
    if (!layoutName) return;

    this.gridLayout.deleteNamed(this.layoutKey, layoutName);
    this.refreshLayoutNames('');
  }

  isReservedLayoutName(layoutName: string): boolean {
    return this.gridLayout.isReservedName(layoutName);
  }

  canDeleteLayoutName(layoutName: string): boolean {
    const normalizedName = layoutName.trim();
    return this.layoutNames().some(name => name === normalizedName);
  }

  private applyLayout(layoutName: string): void {
    if (!this.gridApi) return;

    const normalizedName = layoutName.trim();
    if (!normalizedName || this.isReservedLayoutName(normalizedName)) {
      this.applyDefaultLayout();
      return;
    }

    const layoutState = this.gridLayout.loadNamed(this.layoutKey, normalizedName);
    if (!layoutState) return;

    this.gridLayout.setActiveName(this.layoutKey, normalizedName);
    this.gridApi.setState(layoutState);
    this.refreshLayoutNames(normalizedName);
  }

  private applyDefaultLayout(): void {
    if (!this.gridApi) return;

    this.gridLayout.setActiveName(this.layoutKey, '');
    this.gridApi.resetColumnState();
    this.gridApi.setFilterModel(null);
    requestAnimationFrame(() => this.gridApi?.autoSizeAllColumns(false));
    this.refreshLayoutNames('');
  }

  private refreshLayoutNames(activeName: string): void {
    this.layoutNames.set(this.gridLayout.names(this.layoutKey));
    this.layoutDraftName.set(activeName || 'Default');
  }

  private normalizedLayoutName(): string {
    return this.layoutDraftName().trim();
  }

  private showLayoutSaveMessage(layoutName: string): void {
    if (this.saveMessageTimer) {
      clearTimeout(this.saveMessageTimer);
    }

    this.layoutSaveMessage.set(`Saved "${layoutName}"`);
    this.saveMessageTimer = setTimeout(() => this.layoutSaveMessage.set(''), 2500);
  }
}
