import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InventoryPage, InventoryPageRequest } from '../models/inventory-page.model';
import { TradingDataService } from '@core/services/trading-data.service';
import { InventoryPageDto } from '../models/inventory.dto';
import { mapInventoryPageDto, mapInventoryPageToDto } from './inventory.mapper';

@Injectable({
  providedIn: 'root',
})
export class InventoryDataService {
  private readonly tradingData = inject(TradingDataService);

  readonly refreshIntervalMs = this.tradingData.refreshIntervalMs;

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
