import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InventoryRow } from '../models/inventory-row.model';
import { SingleNameDetail } from '../models/single-name.model';
import { MockTradingDataService } from './mock-trading-data.service';

export const TRADING_DATA_REFRESH_INTERVAL_MS = new InjectionToken<number>(
  'TRADING_DATA_REFRESH_INTERVAL_MS',
  {
    providedIn: 'root',
    factory: () => 15000,
  },
);

@Injectable({
  providedIn: 'root',
})
export class TradingDataService {
  private readonly mockData = inject(MockTradingDataService);
  readonly refreshIntervalMs = inject(TRADING_DATA_REFRESH_INTERVAL_MS);

  getInventoryRows(): Observable<InventoryRow[]> {
    return of(this.mockData.getInventoryRows());
  }

  getSingleName(ticker: string): Observable<SingleNameDetail> {
    return of(this.mockData.getSingleName(ticker));
  }
}
