// src/app/features/inventory/pages/inventory-page/inventory-page.ts
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import {
  AllCommunityModule,
  CellClickedEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import { ServerSideRowModelModule } from 'ag-grid-enterprise';
import { TradingDataService } from '../../../../core/services/trading-data.service';
import { WorkbenchTabsService } from '../../../../core/services/workbench-tabs.service';
import { InventoryRow } from '../../../../core/models/inventory-row.model';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [AgGridAngular, RouterLink],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
})
export class InventoryPage {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataService = inject(TradingDataService);
  private readonly tabsService = inject(WorkbenchTabsService);
  private gridApi?: GridApi<InventoryRow>;

  readonly selectedView = signal<'sod' | 'live' | 'gc' | 'warm' | 'htb' | 'special'>('live');
  readonly includeRecalls = signal(true);
  readonly rounding = signal(true);

  readonly agGridModules = [AllCommunityModule, ServerSideRowModelModule];
  readonly securityTabs = this.tabsService.securityTabs;

  readonly serverSideDatasource: IServerSideDatasource<InventoryRow> = {
    getRows: (params: IServerSideGetRowsParams<InventoryRow>) => {
      const startRow = params.request.startRow ?? 0;
      const endRow = params.request.endRow ?? startRow + 20;
      const pageSize = endRow - startRow;
      const pageIndex = Math.floor(startRow / pageSize);

      this.dataService.getInventoryPage({ pageIndex, pageSize }).subscribe({
        next: page => {
          params.success({
            rowData: page.rows,
            rowCount: page.totalCount,
          });
        },
        error: () => params.fail(),
      });
    },
  };

  readonly columnDefs: ColDef<InventoryRow>[] = [
    {
      field: 'status',
      headerName: 'SOD Excess Deficit Status',
      pinned: 'left',
      width: 160,
      cellClass: params => params.value?.includes('Borrow') ? 'status-borrow' : 'status-covered',
    },
    {
      field: 'ticker',
      headerName: 'BBG',
      pinned: 'left',
      width: 90,
      cellClass: 'bbg-link-cell',
    },
    { field: 'cusip', headerName: 'CUSIP', pinned: 'left', width: 120 },
    { field: 'description', headerName: 'Description', pinned: 'left', width: 220 },
    { field: 'type', headerName: 'Type', pinned: 'left', width: 80 },
    { field: 'price', headerName: 'Price', pinned: 'left', width: 90 },
    { field: 'openingCA', headerName: 'Opening CA', pinned: 'left', width: 120 },
    { field: 'recordDate', headerName: 'Record Date', pinned: 'left', width: 120 },
    { field: 'excessDeficit', headerName: 'Excess Deficit', width: 140 },
    { field: 'liveExcessDeficit', headerName: 'Live Excess Deficit', width: 160 },
    { field: 'sodBorrowNeed', headerName: 'SOD Borrow Need', width: 150 },
    { field: 'sodExcessReturn', headerName: 'SOD Excess Return', width: 160 },
    { field: 'sod214Proj', headerName: 'SOD 214 Proj', width: 140 },
    { field: 'sodAfrProj', headerName: 'SOD AFR Proj', width: 140 },
    { field: 'sodUsPmProj', headerName: 'SOD USPM Proj', width: 150 },
    { field: 'sodOtherProj', headerName: 'SOD OTHER Proj', width: 150 },
    { field: 'settled214', headerName: '214 Settled', width: 130 },
    { field: 'settledAfr', headerName: 'AFR Settled', width: 130 },
    { field: 'settledUsPm', headerName: 'USPM Settled', width: 140 },
    { field: 'otherSettled', headerName: 'OTHER Settled', width: 140 },
    { field: 'pending214', headerName: '214 Pending', width: 130 },
    { field: 'pendingAfr', headerName: 'AFR Pending', width: 130 },
    { field: 'pendingUsPm', headerName: 'USPM Pending', width: 140 },
    { field: 'pendingOther', headerName: 'OTHER Pending', width: 140 },
  ];

  readonly gridOptions: GridOptions<InventoryRow> = {
    theme: 'legacy',
    rowModelType: 'serverSide',
    serverSideDatasource: this.serverSideDatasource,
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50],
    cacheBlockSize: 20,
    maxBlocksInCache: 3,
    rowHeight: 31,
    headerHeight: 34,
    animateRows: true,
    suppressCellFocus: true,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
    getRowClass: params => {
      if (params.data?.status.includes('Borrow')) return 'borrow-row';
      if (params.data?.status.includes('Need covered')) return 'covered-row';
      return '';
    },
  };

  constructor() {
    interval(this.dataService.refreshIntervalMs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.gridApi?.refreshServerSide({ purge: false }));
  }

  onGridReady(event: GridReadyEvent<InventoryRow>): void {
    this.gridApi = event.api;
  }

  onCellClicked(event: CellClickedEvent<InventoryRow>): void {
    if (event.colDef.field !== 'ticker') return;

    const ticker = event.data?.ticker;
    if (!ticker) return;

    const openedTicker = this.tabsService.openSecurity(ticker);
    this.router.navigate(['/single-name', openedTicker]);
  }

  setView(view: 'sod' | 'live' | 'gc' | 'warm' | 'htb' | 'special'): void {
    this.selectedView.set(view);
  }
}
