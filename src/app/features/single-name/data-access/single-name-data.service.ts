import { Injectable, inject } from '@angular/core';
import { Observable, interval, map, startWith, switchMap } from 'rxjs';
import { SingleNameDetail } from '../models/single-name.model';
import { TradingDataService } from '@core/services/trading-data.service';
import { SingleNameDetailDto } from '../models/single-name.dto';
import { mapSingleNameDetailDto, mapSingleNameDetailToDto } from './single-name.mapper';

@Injectable({
  providedIn: 'root',
})
export class SingleNameDataService {
  private readonly tradingData = inject(TradingDataService);

  getSingleName(ticker: string): Observable<SingleNameDetail> {
    return this.loadSingleNameDto(ticker).pipe(
      map(mapSingleNameDetailDto),
    );
  }

  getRefreshedSingleName(ticker: string): Observable<SingleNameDetail> {
    return interval(this.tradingData.refreshIntervalMs).pipe(
      startWith(0),
      switchMap(() => this.getSingleName(ticker)),
    );
  }

  private loadSingleNameDto(ticker: string): Observable<SingleNameDetailDto> {
    return this.tradingData.getSingleName(ticker).pipe(
      map(mapSingleNameDetailToDto),
    );
  }
}
