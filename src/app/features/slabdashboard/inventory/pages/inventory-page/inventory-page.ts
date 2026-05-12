// src/app/features/slabdashboard/inventory/pages/inventory-page/inventory-page.ts
import { Component, inject } from '@angular/core';
import {
  AllCommunityModule,
  CellClickedEvent,
  ColDef,
  ColumnAutoSizeModule,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridStateModule,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import {
  ColumnsToolPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  SideBarModule,
} from 'ag-grid-enterprise';
import { InventoryRow } from '../../models/inventory-row.model';
import { InventoryViewFilter } from '../../models/inventory-page.model';
import { InventoryStore } from '../../state/inventory.store';
import { AgGridAngular } from 'ag-grid-angular';
import { SlabdashboardHeaderComponent } from '@shared/ui/slabdashboard-header/slabdashboard-header.component';
import { SlabdashboardTabsComponent } from '@shared/ui/slabdashboard-tabs/slabdashboard-tabs.component';
import { GridLayoutService } from '@core/services/grid-layout.service';
import { GridLayoutControlComponent } from '@core/layout/grid-layout-control/grid-layout-control.component';

type NumericInventoryField = {
  [Field in keyof InventoryRow]: InventoryRow[Field] extends number | undefined ? Field : never;
}[keyof InventoryRow];

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [AgGridAngular, GridLayoutControlComponent, SlabdashboardHeaderComponent, SlabdashboardTabsComponent],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
  providers: [InventoryStore],
})
export class InventoryPage {
  readonly store = inject(InventoryStore);
  private readonly gridLayout = inject(GridLayoutService);
  readonly layoutKey = 'inventory';
  gridApi?: GridApi<InventoryRow>;

  readonly agGridModules = [
    AllCommunityModule,
    ServerSideRowModelModule,
    ServerSideRowModelApiModule,
    ColumnsToolPanelModule,
    SideBarModule,
    ColumnAutoSizeModule,
    GridStateModule,
  ];
  private readonly numericColumnClass = 'numeric-cell';

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
      headerName: 'Ticker',
      pinned: 'left',
      width: 280,
      cellClass: 'ticker-link-cell',
      cellRenderer: (params: ICellRendererParams<InventoryRow, string>) => this.renderTickerCell(params),
    },
    {
      field: 'cusip',
      headerName: 'CUSIP',
      pinned: 'left',
      width: 120,
      cellClass: 'cusip-link-cell',
    },
    { field: 'type', headerName: 'Type', pinned: 'left', width: 80 },
    this.numberColumn('price', 'Price', 90, true, true),
    { field: 'upcomingCA', headerName: 'Upcoming CA', pinned: 'left', width: 120 },
    { field: 'recordDate', headerName: 'Record Date', pinned: 'left', width: 120 },
    this.numberColumn('excessDeficit', 'Excess Deficit', 140, false, true),
    this.numberColumn('liveExcessDeficit', 'Live Excess Deficit', 160, false, true),
    this.numberColumn('sodBorrowNeed', 'SOD Borrow Need', 150),
    this.numberColumn('sodExcessReturn', 'SOD Excess Return', 160),
    this.numberColumn('sod214Proj', 'SOD 214 Proj', 140),
    this.numberColumn('sodAfrProj', 'SOD AFR Proj', 140),
    this.numberColumn('sodUsPmProj', 'SOD USPM Proj', 150),
    this.numberColumn('sodOtherProj', 'SOD OTHER Proj', 150),
    this.numberColumn('settled214', '214 Settled', 130),
    this.numberColumn('settledAfr', 'AFR Settled', 130),
    this.numberColumn('settledUsPm', 'USPM Settled', 140),
    this.numberColumn('otherSettled', 'OTHER Settled', 140),
    this.numberColumn('pending214', '214 Pending', 130),
    this.numberColumn('pendingAfr', 'AFR Pending', 130),
    this.numberColumn('pendingUsPm', 'USPM Pending', 140),
    this.numberColumn('pendingOther', 'OTHER Pending', 140),
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
    rowHeight: 28,
    headerHeight: 31,
    animateRows: true,
    suppressCellFocus: true,
    getRowId: params => params.data.ticker,
    onFirstDataRendered: event => this.autoSizeColumns(event),
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
    getRowClass: params => {
      if (params.data?.status.includes('Borrow')) return 'borrow-row';
      if (params.data?.status.includes('Need covered')) return 'covered-row';
      return '';
    },
  };

  onGridReady(event: GridReadyEvent<InventoryRow>): void {
    this.gridApi = event.api;
    this.store.connectGrid(event.api);
  }

  onCellClicked(event: CellClickedEvent<InventoryRow>): void {
    this.store.openSecurityFromCell(event);
  }

  private autoSizeColumns(event: FirstDataRenderedEvent<InventoryRow>): void {
    if (this.gridLayout.hasLayout(this.layoutKey)) return;

    requestAnimationFrame(() => event.api.autoSizeAllColumns(false));
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

  private numberColumn(
    field: NumericInventoryField,
    headerName: string,
    width: number,
    pinned = false,
    animateChange = false,
  ): ColDef<InventoryRow> {
    return {
      field,
      headerName,
      width,
      pinned: pinned ? 'left' : undefined,
      filter: 'agNumberColumnFilter',
      cellRenderer: animateChange ? 'agAnimateShowChangeCellRenderer' : undefined,
      enableCellChangeFlash: animateChange,
      cellClass: params => {
        const classes = [this.numericColumnClass];
        if (field === 'price') {
          classes.push('price-cell');
        }
        if (Number(params.value) < 0) {
          classes.push('negative-cell');
        }
        if (animateChange && field !== 'price' && Number(params.value) > 0) {
          classes.push('positive-cell');
        }

        return classes;
      },
      headerClass: 'numeric-header',
      valueFormatter: params => this.formatNumericValue(params),
    };
  }

  private formatNumericValue(params: ValueFormatterParams<InventoryRow, number | undefined>): string {
    if (params.value === null || params.value === undefined) return '';
    if (params.value === 0) return '-';

    const formattedValue = Math.abs(params.value).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    return params.value < 0 ? `-${formattedValue}` : formattedValue;
  }

  private renderTickerCell(params: ICellRendererParams<InventoryRow, string>): string {
    const ticker = this.escapeHtml(params.value ?? '');
    const description = this.escapeHtml(params.data?.description ?? '');

    return `
      <span class="ticker-cell">
        <span class="ticker-symbol">${ticker}</span>
        <span class="ticker-description">${description}</span>
      </span>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
