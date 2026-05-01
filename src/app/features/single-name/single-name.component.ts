// src/app/features/single-name/single-name.component.ts
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule as AllGridCommunityModule, ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { AgCartesianChartOptions, AllCommunityModule as AllChartCommunityModule, ModuleRegistry as ChartModuleRegistry } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-angular';
import { MockTradingDataService } from '../../core/services/mock-trading-data.service';
import { WorkbenchTabsService } from '../../core/services/workbench-tabs.service';
import { LenderAvailabilityRow } from '../../core/models/single-name.model';

ChartModuleRegistry.registerModules(AllChartCommunityModule);

@Component({
  selector: 'app-single-name',
  standalone: true,
  imports: [AgGridAngular, AgCharts, RouterLink],
  templateUrl: './single-name.component.html',
  styleUrl: './single-name.component.scss',
})
export class SingleNameComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataService = inject(MockTradingDataService);
  private readonly tabsService = inject(WorkbenchTabsService);

  readonly ticker = signal(this.route.snapshot.paramMap.get('ticker') ?? 'FULT');
  readonly securityTabs = this.tabsService.securityTabs;
  readonly drilldownVisible = signal(false);
  readonly showOptions = signal(false);

  readonly agGridModules = [AllGridCommunityModule];
  readonly detail = computed(() => this.dataService.getSingleName(this.ticker()));
  readonly lenderRows = computed(() => this.detail().lenderAvailability);
  readonly drilldownRows = computed(() => this.detail().drilldown);

  readonly lenderColumnDefs: ColDef<LenderAvailabilityRow>[] = [
    { field: 'cpty', headerName: 'CPTY', width: 90 },
    { field: 'cptyName', headerName: 'CPTY_NAME', width: 230 },
    {
      field: 'percentTotalAvail',
      headerName: '% TOTAL AVAIL',
      width: 160,
      cellRenderer: (params: ICellRendererParams<LenderAvailabilityRow, number>) => {
        const value = Number(params.value ?? 0);
        return `
          <div class="bar-cell">
            <div class="bar-fill" style="width:${value}%"></div>
            <span>${value}%</span>
          </div>
        `;
      },
    },
    { field: 'quantity', headerName: 'QUANTITY', width: 130 },
    { field: 'quantityHc', headerName: 'QUANTITY_HC', width: 130 },
    { field: 'quantityPrevday', headerName: 'QUANTITY_PREVDAY', width: 160 },
    { field: 'quantityHcPrevday', headerName: 'QUANTITY_HC_PREVDAY', width: 180 },
    { field: 'quantityDiffToPrevday', headerName: 'QUANTITY_DIFF_TO_PREVDAY', width: 220 },
    { field: 'quantityHcDiffToPrevday', headerName: 'QUANTITY_HC_DIFF_TO_PREVDAY', width: 230 },
    { field: 'diffPercent', headerName: 'Diff %', width: 100 },
  ];

  readonly drilldownColumnDefs: ColDef[] = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'activityType', headerName: 'Activity type', width: 160 },
    { field: 'projected214', headerName: '214 Projected', width: 140 },
    { field: 'settled214', headerName: '214 Settled', width: 140 },
    { field: 'pending214', headerName: '214 Pending', width: 140 },
    { field: 'projected2864', headerName: '2864 Projected', width: 140 },
    { field: 'settled2864', headerName: '2864 Settled', width: 140 },
    { field: 'pending2864', headerName: '2864 Pending', width: 140 },
  ];

  readonly gridOptions: GridOptions = {
    theme: 'legacy',
    rowHeight: 30,
    headerHeight: 33,
    suppressCellFocus: true,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
  };

  readonly chartOptions = computed<AgCartesianChartOptions>(() => ({
    data: this.detail().fees,
    height: 210,
    title: {
      text: 'Lending Pit',
    },
    series: [
      {
        type: 'line',
        xKey: 'period',
        yKey: 'value',
        marker: {
          enabled: true,
        },
      },
    ],
    axes: {
      x: {
        type: 'category',
        position: 'bottom',
      },
      y: {
        type: 'number',
        position: 'left',
      },
    },
  }));

  constructor() {
    this.tabsService.openSecurity(this.ticker());

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const ticker = this.tabsService.openSecurity(params.get('ticker') ?? 'FULT');
        this.ticker.set(ticker);
      });
  }

  toggleDrilldown(): void {
    this.drilldownVisible.update(value => !value);
  }

  toggleOptions(): void {
    this.showOptions.update(value => !value);
  }
}
