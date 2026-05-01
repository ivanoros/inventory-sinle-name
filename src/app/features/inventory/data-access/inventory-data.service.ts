import { Injectable, inject } from '@angular/core';
import { IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { Observable, map } from 'rxjs';
import { InventoryPage, InventoryPageRequest } from '../models/inventory-page.model';
import { InventoryRow } from '../models/inventory-row.model';
import { TradingDataService } from '../../../core/services/trading-data.service';
import { InventoryPageDto } from '../models/inventory.dto';
import { mapInventoryPageDto, mapInventoryPageToDto } from './inventory.mapper';

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

        this.getInventoryPage({ pageIndex, pageSize }).subscribe({
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

  getInventoryPage(request: InventoryPageRequest): Observable<InventoryPage> {
    return this.loadInventoryPageDto(request).pipe(
      map(mapInventoryPageDto),
    );
  }

  private loadInventoryPageDto(request: InventoryPageRequest): Observable<InventoryPageDto> {
    return this.tradingData.getInventoryPage(request).pipe(
      map(mapInventoryPageToDto),
    );
  }
}
