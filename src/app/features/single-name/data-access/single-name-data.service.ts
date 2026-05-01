import { Injectable, inject } from '@angular/core';
import { Observable, interval, startWith, switchMap } from 'rxjs';
import { SingleNameDetail } from '../../../core/models/single-name.model';
import { TradingDataService } from '../../../core/services/trading-data.service';

@Injectable({
  providedIn: 'root',
})
export class SingleNameDataService {
  private readonly tradingData = inject(TradingDataService);

  getSingleName(ticker: string): Observable<SingleNameDetail> {
    return this.tradingData.getSingleName(ticker);
  }

  getRefreshedSingleName(ticker: string): Observable<SingleNameDetail> {
    return interval(this.tradingData.refreshIntervalMs).pipe(
      startWith(0),
      switchMap(() => this.getSingleName(ticker)),
    );
  }
}
