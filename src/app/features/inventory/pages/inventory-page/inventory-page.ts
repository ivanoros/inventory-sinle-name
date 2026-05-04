// src/app/features/inventory/pages/inventory-page/inventory-page.ts
import { Component, inject } from '@angular/core';
import {
  AllCommunityModule,
  CellClickedEvent,
  ColDef,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { ServerSideRowModelModule } from 'ag-grid-enterprise';
import { InventoryRow } from '../../models/inventory-row.model';
import { InventoryViewFilter } from '../../models/inventory-page.model';
import { InventoryStore } from '../../state/inventory.store';
import { AgGridAngular } from 'ag-grid-angular';
import { WorkbenchHeaderComponent } from '@shared/ui/workbench-header/workbench-header.component';
import { WorkbenchTabsComponent } from '@shared/ui/workbench-tabs/workbench-tabs.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [AgGridAngular, WorkbenchHeaderComponent, WorkbenchTabsComponent],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
  providers: [InventoryStore],
})
export class InventoryPage {
  readonly store = inject(InventoryStore);

  readonly agGridModules = [AllCommunityModule, ServerSideRowModelModule];

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
    {
      field: 'cusip',
      headerName: 'CUSIP',
      pinned: 'left',
      width: 120,
      cellClass: 'cusip-link-cell',
    },
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
    serverSideDatasource: this.store.serverSideDatasource,
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

  onGridReady(event: GridReadyEvent<InventoryRow>): void {
    this.store.connectGrid(event.api);
  }

  onCellClicked(event: CellClickedEvent<InventoryRow>): void {
    this.store.openSecurityFromCell(event);
  }

  closeSecurityTab(ticker: string): void {
    this.store.closeSecurityTab(ticker);
  }

  closeInventoryTab(): void {
    this.store.closeInventoryTab();
  }

  setView(view: InventoryViewFilter): void {
    this.store.setView(view);
  }
}
