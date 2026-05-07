// src/app/features/slabdashboard/single-name/pages/single-name-page/single-name-page.ts
import { Component, DestroyRef, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import {
  AllCommunityModule as AllGridCommunityModule,
  ColDef,
  ColumnAutoSizeModule,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridPreDestroyedEvent,
  GridReadyEvent,
  GridStateModule,
  StateUpdatedEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AllCommunityModule as AllChartCommunityModule, ModuleRegistry as ChartModuleRegistry } from 'ag-charts-community';
import { ColumnsToolPanelModule, SideBarModule } from 'ag-grid-enterprise';
import { SecuritySummaryComponent } from '../../components/security-summary/security-summary.component';
import { PositionPanelComponent } from '../../components/position-panel/position-panel.component';
import { LenderAvailabilityComponent } from '../../components/lender-availability/lender-availability.component';
import { SingleNameSidebarComponent } from '../../components/single-name-sidebar/single-name-sidebar.component';
import { SingleNameStore } from '../../state/single-name.store';
import { ErrorAlertComponent } from '@shared/ui/error-alert/error-alert.component';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';
import { SlabdashboardHeaderComponent } from '@shared/ui/slabdashboard-header/slabdashboard-header.component';
import { SlabdashboardTabsComponent } from '@shared/ui/slabdashboard-tabs/slabdashboard-tabs.component';
import { GridLayoutService } from '@core/services/grid-layout.service';

ChartModuleRegistry.registerModules(AllChartCommunityModule);

@Component({
  selector: 'app-single-name',
  standalone: true,
  imports: [
    SlabdashboardHeaderComponent,
    SlabdashboardTabsComponent,
    RouterLink,
    SecuritySummaryComponent,
    PositionPanelComponent,
    LenderAvailabilityComponent,
    SingleNameSidebarComponent,
    ErrorAlertComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './single-name-page.html',
  styleUrl: './single-name-page.scss',
  providers: [SingleNameStore],
})
export class SingleNamePage {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly gridLayout = inject(GridLayoutService);
  private readonly drilldownLayoutKey = 'single-name-drilldown';
  private readonly lenderLayoutKey = 'single-name-lender';
  private readonly gridApis = new Map<string, GridApi>();
  readonly store = inject(SingleNameStore);
  readonly replacesInventory = signal(false);

  readonly agGridModules = [
    AllGridCommunityModule,
    ColumnAutoSizeModule,
    ColumnsToolPanelModule,
    SideBarModule,
    GridStateModule,
  ];

  readonly drilldownColumnDefs: ColDef[] = [
    { field: 'category', headerName: 'Category', pinned: 'left', width: 150 },
    { field: 'activityType', headerName: 'Activity type', pinned: 'left', width: 170 },
    { field: 'market', headerName: 'Market', width: 95 },
    { field: 'account', headerName: 'Account', width: 105 },
    { field: 'description', headerName: 'Description', width: 230 },
    this.numberColumn('projectedTotal', 'Projected Total', 145),
    this.numberColumn('settledTotal', 'Settled Total', 135),
    this.numberColumn('pendingTotal', 'Pending Total', 135),
    this.numberColumn('projected214', '214 Projected', 135),
    this.numberColumn('settled214', '214 Settled', 125),
    this.numberColumn('pending214', '214 Pending', 125),
    this.numberColumn('projected2864', '2864 Projected', 140),
    this.numberColumn('settled2864', '2864 Settled', 130),
    this.numberColumn('pending2864', '2864 Pending', 130),
  ];

  readonly drilldownLayoutNames = signal(this.gridLayout.names(this.drilldownLayoutKey));
  readonly selectedDrilldownLayoutName = signal(this.gridLayout.activeName(this.drilldownLayoutKey));
  readonly drilldownLayoutDraftName = signal(this.selectedDrilldownLayoutName());
  readonly lenderLayoutNames = signal(this.gridLayout.names(this.lenderLayoutKey));
  readonly selectedLenderLayoutName = signal(this.gridLayout.activeName(this.lenderLayoutKey));
  readonly lenderLayoutDraftName = signal(this.selectedLenderLayoutName());

  readonly drilldownGridOptions = this.createGridOptions(this.drilldownLayoutKey);
  readonly lenderGridOptions = this.createGridOptions(this.lenderLayoutKey);

  private createGridOptions(layoutKey: string): GridOptions {
    return {
    theme: 'legacy',
    rowHeight: 28,
    headerHeight: 31,
    suppressCellFocus: true,
    initialState: this.gridLayout.load(layoutKey),
    onGridReady: event => this.registerGridApi(layoutKey, event),
    onFirstDataRendered: event => this.autoSizeColumns(event, layoutKey),
    onStateUpdated: event => this.saveGridLayout(layoutKey, event),
    onGridPreDestroyed: event => this.saveGridLayout(layoutKey, event),
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
          },
        },
      ],
    },
    defaultColDef: {
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
    },
    };
  }

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, queryParams]) => {
        const replacesInventory = queryParams.get('view') === 'inventory';
        this.replacesInventory.set(replacesInventory);
        this.store.setTicker(params.get('ticker'), { openTab: !replacesInventory });
      });
  }

  toggleDrilldown(): void {
    this.store.toggleDrilldown();
  }

  toggleOptions(): void {
    this.store.toggleOptions();
  }

  startSidebarResize(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.store.startSidebarResize(event.clientX);
  }

  resizeSidebar(event: PointerEvent): void {
    this.store.resizeSidebar(event.clientX);
  }

  stopSidebarResize(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    this.store.stopSidebarResize();
  }

  closeSecurityTab(ticker: string): void {
    this.store.closeSecurityTab(ticker);
  }

  closeInventoryTab(): void {
    this.store.closeInventoryTab();
  }

  setDrilldownLayoutDraftName(event: Event): void {
    this.setLayoutDraftName(event, this.drilldownLayoutDraftName);
  }

  selectDrilldownLayout(event: Event): void {
    this.selectLayout(
      event,
      this.drilldownLayoutKey,
      this.selectedDrilldownLayoutName,
      this.drilldownLayoutDraftName,
    );
  }

  saveDrilldownLayout(): void {
    this.saveNamedLayout(
      this.drilldownLayoutKey,
      this.drilldownLayoutDraftName,
      this.selectedDrilldownLayoutName,
      this.drilldownLayoutNames,
    );
  }

  applyDrilldownLayout(): void {
    this.applyNamedLayout(this.drilldownLayoutKey, this.selectedDrilldownLayoutName);
  }

  deleteDrilldownLayout(): void {
    this.deleteNamedLayout(
      this.drilldownLayoutKey,
      this.selectedDrilldownLayoutName,
      this.drilldownLayoutDraftName,
      this.drilldownLayoutNames,
    );
  }

  setLenderLayoutDraftName(event: Event): void {
    this.setLayoutDraftName(event, this.lenderLayoutDraftName);
  }

  selectLenderLayout(event: Event): void {
    this.selectLayout(
      event,
      this.lenderLayoutKey,
      this.selectedLenderLayoutName,
      this.lenderLayoutDraftName,
    );
  }

  saveLenderLayout(): void {
    this.saveNamedLayout(
      this.lenderLayoutKey,
      this.lenderLayoutDraftName,
      this.selectedLenderLayoutName,
      this.lenderLayoutNames,
    );
  }

  applyLenderLayout(): void {
    this.applyNamedLayout(this.lenderLayoutKey, this.selectedLenderLayoutName);
  }

  deleteLenderLayout(): void {
    this.deleteNamedLayout(
      this.lenderLayoutKey,
      this.selectedLenderLayoutName,
      this.lenderLayoutDraftName,
      this.lenderLayoutNames,
    );
  }

  private registerGridApi(layoutKey: string, event: GridReadyEvent): void {
    this.gridApis.set(layoutKey, event.api);
  }

  private autoSizeColumns(event: FirstDataRenderedEvent, layoutKey: string): void {
    if (this.gridLayout.hasLayout(layoutKey)) return;

    requestAnimationFrame(() => event.api.autoSizeAllColumns(false));
  }

  private saveGridLayout(layoutKey: string, event: StateUpdatedEvent | GridPreDestroyedEvent): void {
    this.gridLayout.save(layoutKey, event.state);
  }

  private setLayoutDraftName(event: Event, draftName: WritableSignal<string>): void {
    draftName.set((event.target as HTMLInputElement).value);
  }

  private selectLayout(
    event: Event,
    layoutKey: string,
    selectedName: WritableSignal<string>,
    draftName: WritableSignal<string>,
  ): void {
    const layoutName = (event.target as HTMLSelectElement).value;
    selectedName.set(layoutName);
    draftName.set(layoutName);
  }

  private saveNamedLayout(
    layoutKey: string,
    draftName: WritableSignal<string>,
    selectedName: WritableSignal<string>,
    layoutNames: WritableSignal<string[]>,
  ): void {
    const gridApi = this.gridApis.get(layoutKey);
    const layoutName = draftName().trim();
    if (!gridApi || !layoutName) return;

    this.gridLayout.saveNamed(layoutKey, layoutName, gridApi.getState());
    this.refreshLayoutNames(layoutKey, layoutName, selectedName, draftName, layoutNames);
  }

  private applyNamedLayout(layoutKey: string, selectedName: WritableSignal<string>): void {
    const gridApi = this.gridApis.get(layoutKey);
    const layoutName = selectedName();
    const layoutState = this.gridLayout.loadNamed(layoutKey, layoutName);
    if (!gridApi || !layoutName || !layoutState) return;

    this.gridLayout.setActiveName(layoutKey, layoutName);
    gridApi.setState(layoutState);
  }

  private deleteNamedLayout(
    layoutKey: string,
    selectedName: WritableSignal<string>,
    draftName: WritableSignal<string>,
    layoutNames: WritableSignal<string[]>,
  ): void {
    const layoutName = selectedName();
    if (!layoutName) return;

    this.gridLayout.deleteNamed(layoutKey, layoutName);
    this.refreshLayoutNames(layoutKey, '', selectedName, draftName, layoutNames);
  }

  private refreshLayoutNames(
    layoutKey: string,
    activeName: string,
    selectedName: WritableSignal<string>,
    draftName: WritableSignal<string>,
    layoutNames: WritableSignal<string[]>,
  ): void {
    layoutNames.set(this.gridLayout.names(layoutKey));
    selectedName.set(activeName);
    draftName.set(activeName);
  }

  private numberColumn(field: string, headerName: string, width: number): ColDef {
    return {
      field,
      headerName,
      width,
      filter: 'agNumberColumnFilter',
      cellClass: params => {
        const classes = ['numeric-cell'];
        if (Number(params.value) < 0) {
          classes.push('negative-cell');
        }

        return classes;
      },
      headerClass: 'numeric-header',
      valueFormatter: params => this.formatNumericValue(params),
    };
  }

  private formatNumericValue(params: ValueFormatterParams): string {
    if (params.value === null || params.value === undefined) return '';
    if (params.value === 0) return '-';

    const numericValue = Number(params.value);
    if (Number.isNaN(numericValue)) return String(params.value);

    const formattedValue = Math.abs(numericValue).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    return numericValue < 0 ? `-${formattedValue}` : formattedValue;
  }
}
