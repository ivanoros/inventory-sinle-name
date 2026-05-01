import { Injectable, inject } from '@angular/core';
import { IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { InventoryRow } from '../../../core/models/inventory-row.model';
import { TradingDataService } from '../../../core/services/trading-data.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryDataService {
  private readonly tradingData = inject(TradingDataService);

  readonly refreshIntervalMs = this.tradingData.refreshIntervalMs;

  createServerSideDatasource(): IServerSideDatasource<InventoryRow> {
    return {
      getRows: (params: IServerSideGetRowsParams<InventoryRow>) => {
        const startRow = params.request.startRow ?? 0;
        const endRow = params.request.endRow ?? startRow + 20;
        const pageSize = endRow - startRow;
        const pageIndex = Math.floor(startRow / pageSize);

        this.tradingData.getInventoryPage({ pageIndex, pageSize }).subscribe({
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
