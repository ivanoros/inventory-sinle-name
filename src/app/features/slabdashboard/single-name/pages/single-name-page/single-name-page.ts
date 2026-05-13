// src/app/features/slabdashboard/single-name/pages/single-name-page/single-name-page.ts
import { Component, DestroyRef, inject, signal } from '@angular/core';
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
  GridReadyEvent,
  GridStateModule,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AllCommunityModule as AllChartCommunityModule, ModuleRegistry as ChartModuleRegistry } from 'ag-charts-community';
import { ColumnsToolPanelModule, SideBarModule } from 'ag-grid-enterprise';
import { ButtonModule } from 'primeng/button';
import { CaretRightIcon } from 'primeng/icons/caretright';
import { RefreshIcon } from 'primeng/icons/refresh';
import { TimesIcon } from 'primeng/icons/times';
import { SecuritySummaryComponent } from '../../components/security-summary/security-summary.component';
import { PositionPanelComponent } from '../../components/position-panel/position-panel.component';
import { LenderAvailabilityComponent } from '../../components/lender-availability/lender-availability.component';
import { SingleNameSidebarComponent } from '../../components/single-name-sidebar/single-name-sidebar.component';
import { SingleNameStore } from '../../state/single-name.store';
import { ErrorAlertComponent } from '@shared/ui/error-alert/error-alert.component';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';
import { SlabdashboardHeaderComponent } from '@shared/ui/slabdashboard-header/slabdashboard-header.component';
import { SlabdashboardTabsComponent } from '@shared/ui/slabdashboard-tabs/slabdashboard-tabs.component';
import {
  GridLayoutControlComponent,
  GridLayoutTarget,
} from '@core/layout/grid-layout-control/grid-layout-control.component';

ChartModuleRegistry.registerModules(AllChartCommunityModule);

@Component({
  selector: 'app-single-name',
  standalone: true,
  imports: [
    SlabdashboardHeaderComponent,
    SlabdashboardTabsComponent,
    ButtonModule,
    CaretRightIcon,
    RouterLink,
    RefreshIcon,
    SecuritySummaryComponent,
    PositionPanelComponent,
    LenderAvailabilityComponent,
    SingleNameSidebarComponent,
    GridLayoutControlComponent,
    ErrorAlertComponent,
    LoadingSpinnerComponent,
    TimesIcon,
  ],
  templateUrl: './single-name-page.html',
  styleUrl: './single-name-page.scss',
  providers: [SingleNameStore],
})
export class SingleNamePage {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly singleNameLayoutKey = 'single-name';
  readonly drilldownLayoutKey = 'single-name-drilldown';
  readonly lenderLayoutKey = 'single-name-lender';
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

  readonly drilldownGridOptions = this.createGridOptions(this.drilldownLayoutKey);
  readonly lenderGridOptions = this.createGridOptions(this.lenderLayoutKey);

  private createGridOptions(layoutKey: string): GridOptions {
    return {
    theme: 'legacy',
    rowHeight: 28,
    headerHeight: 31,
    suppressCellFocus: true,
    onGridReady: event => this.registerGridApi(layoutKey, event),
    onFirstDataRendered: event => this.autoSizeColumns(event, layoutKey),
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

  refreshFromBackend(): void {
    this.store.refreshFromBackend();
  }

  toggleRefreshTimer(): void {
    this.store.toggleRefreshTimer();
  }

  private registerGridApi(layoutKey: string, event: GridReadyEvent): void {
    this.gridApis.set(layoutKey, event.api);
  }

  gridApiFor(layoutKey: string): GridApi | undefined {
    return this.gridApis.get(layoutKey);
  }

  singleNameLayoutTargets(): GridLayoutTarget[] {
    return [
      { key: this.drilldownLayoutKey, gridApi: this.gridApiFor(this.drilldownLayoutKey) },
      { key: this.lenderLayoutKey, gridApi: this.gridApiFor(this.lenderLayoutKey) },
    ];
  }

  private autoSizeColumns(event: FirstDataRenderedEvent, layoutKey: string): void {
    requestAnimationFrame(() => event.api.autoSizeAllColumns(false));
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
