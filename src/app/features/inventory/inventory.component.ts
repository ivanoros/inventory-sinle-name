// src/app/features/inventory/inventory.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AllCommunityModule, CellClickedEvent, ColDef, GridOptions } from 'ag-grid-community';
import { MockTradingDataService } from '../../core/services/mock-trading-data.service';
import { InventoryRow } from '../../core/models/inventory-row.model';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  private readonly router = inject(Router);
  private readonly dataService = inject(MockTradingDataService);

  readonly selectedView = signal<'sod' | 'live' | 'gc' | 'warm' | 'htb' | 'special'>('live');
  readonly includeRecalls = signal(true);
  readonly rounding = signal(true);

  readonly agGridModules = [AllCommunityModule];
  readonly rows = computed(() => this.dataService.getInventoryRows());

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

  onCellClicked(event: CellClickedEvent<InventoryRow>): void {
    if (event.colDef.field !== 'ticker') return;

    const ticker = event.data?.ticker;
    if (!ticker) return;

    this.router.navigate(['/single-name', ticker]);
  }

  setView(view: 'sod' | 'live' | 'gc' | 'warm' | 'htb' | 'special'): void {
    this.selectedView.set(view);
  }
}
