import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import {
  CellClickedEvent,
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import { WorkbenchTabsService } from '../../../core/services/workbench-tabs.service';
import { InventoryDataService } from '../data-access/inventory-data.service';
import { InventoryViewFilter } from '../models/inventory-page.model';
import { InventoryRow } from '../models/inventory-row.model';

@Injectable()
export class InventoryStore {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly inventoryData = inject(InventoryDataService);
  private readonly tabsService = inject(WorkbenchTabsService);
  private gridApi?: GridApi<InventoryRow>;

  readonly selectedView = signal<InventoryViewFilter>('live');
  readonly includeRecalls = signal(true);
  readonly rounding = signal(true);

  readonly filters = computed(() => ({
    view: this.selectedView(),
    includeRecalls: this.includeRecalls(),
    rounding: this.rounding(),
  }));

  readonly inventoryTabOpen = this.tabsService.inventoryTabOpen;
  readonly securityTabs = this.tabsService.securityTabs;
  readonly serverSideDatasource = this.createServerSideDatasource();

  constructor() {
    this.tabsService.openInventory();

    interval(this.inventoryData.refreshIntervalMs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshRows());
  }

  connectGrid(api: GridApi<InventoryRow>): void {
    this.gridApi = api;
  }

  openSecurityFromCell(event: CellClickedEvent<InventoryRow>): void {
    if (event.colDef.field !== 'ticker') return;

    const ticker = event.data?.ticker;
    if (!ticker) return;

    const openedTicker = this.tabsService.openSecurity(ticker);
    this.router.navigate(['/single-name', openedTicker]);
  }

  closeSecurityTab(ticker: string): void {
    this.tabsService.closeSecurity(ticker);
  }

  closeInventoryTab(): void {
    const nextTicker = this.tabsService.closeInventory();
    if (nextTicker) {
      this.router.navigate(['/single-name', nextTicker]);
    }
  }

  setView(view: InventoryViewFilter): void {
    this.selectedView.set(view);
    this.refreshRows(true);
  }

  private refreshRows(purge = false): void {
    this.gridApi?.refreshServerSide({ purge });
  }

  private createServerSideDatasource(): IServerSideDatasource<InventoryRow> {
    return {
      getRows: (params: IServerSideGetRowsParams<InventoryRow>) => {
        const startRow = params.request.startRow ?? 0;
        const endRow = params.request.endRow ?? startRow + 20;
        const pageSize = endRow - startRow;
        const pageIndex = Math.floor(startRow / pageSize);

        this.inventoryData.getInventoryPage({
          pageIndex,
          pageSize,
          view: this.selectedView(),
        }).subscribe({
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
  }
}
