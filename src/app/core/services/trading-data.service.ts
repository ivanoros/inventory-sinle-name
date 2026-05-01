import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InventoryRow } from '../models/inventory-row.model';
import { SingleNameDetail } from '../models/single-name.model';
import { MockTradingDataService } from './mock-trading-data.service';

@Injectable({
  providedIn: 'root',
})
export class TradingDataService {
  private readonly mockData = inject(MockTradingDataService);

  getInventoryRows(): Observable<InventoryRow[]> {
    return of(this.mockData.getInventoryRows());
  }

  getSingleName(ticker: string): Observable<SingleNameDetail> {
    return of(this.mockData.getSingleName(ticker));
  }
}
