// src/app/core/services/mock-trading-data.service.ts
import { Injectable } from '@angular/core';
import { InventoryRow } from '../models/inventory-row.model';
import { SingleNameDetail } from '../models/single-name.model';

@Injectable({
  providedIn: 'root',
})
export class MockTradingDataService {
  getInventoryRows(): InventoryRow[] {
    return [
      {
        status: 'Borrow need',
        ticker: 'FULT',
        cusip: '360271100',
        description: 'FULTON FINANCIAL CORP',
        type: 'EQTY',
        price: 20.64,
        excessDeficit: -8525,
        liveExcessDeficit: 75,
        sodBorrowNeed: 8600,
        sod214Proj: -7353,
        sodAfrProj: -10586,
        sodUsPmProj: 2061,
        settled214: 1247,
        settledAfr: 8600,
      },
      {
        status: 'Need covered',
        ticker: 'AIR',
        cusip: '00945R102',
        description: 'ARCHER AVIATION INC-A',
        type: 'EQTY',
        price: 8.86,
        excessDeficit: 8275,
        sodBorrowNeed: 8600,
        sod214Proj: 8275,
        sodOtherProj: 1337,
      },
      {
        status: 'Settlement pending',
        ticker: 'ALB',
        cusip: '012653101',
        description: 'ALBEMARLE CORP',
        type: 'EQTY',
        price: 173.78,
        excessDeficit: 1435,
        liveExcessDeficit: 1435,
        sodAfrProj: 1435,
      },
      {
        status: 'Borrow need',
        ticker: 'CRWD',
        cusip: '22788C105',
        description: 'CROWDSTRIKE HOLDINGS INC',
        type: 'EQTY',
        price: 455,
        excessDeficit: -11724,
        liveExcessDeficit: -12061,
        sod214Proj: -11724,
        settledAfr: -12061,
      },
      {
        status: 'Borrow need',
        ticker: 'PL',
        cusip: '72703X106',
        description: 'PLANET LABS PBC',
        type: 'EQTY',
        price: 28.28,
        excessDeficit: -11896,
        liveExcessDeficit: -11896,
        sod214Proj: -11896,
        settled214: -6007,
      },
    ];
  }

  getSingleName(ticker: string): SingleNameDetail {
    return {
      ticker,
      securityId: '2356585',
      name: 'Fulton Financial Corp',
      country: 'US',
      cusip: '360271100 | US3602711000',
      sector: 'Banks | Financial',
      type: 'EQTY | Tier 3',
      price: 19.67,
      corporateAction: '27-Feb-2026 (Div - $0.19)',
      netPnl: 539.23,
      pnlOpp: 798.10,
      watchList: 'Biagio BONANNO',
      lenderTotal: '210,019,588',
      dailyChange: '(205,901,556)',
      fees: [
        { period: 'Live', value: 3.4673 },
        { period: '1D', value: 3.4673 },
        { period: '7D', value: 3.5897 },
        { period: '14D', value: 3.5546 },
        { period: '30D', value: 3.4706 },
        { period: 'Av', value: 3.5558 },
      ],
      lenderAvailability: [
        {
          cpty: '8610',
          cptyName: 'VANGUARD GROUP',
          percentTotalAvail: 17,
          quantity: 17714547,
          quantityHc: 15943092,
          quantityPrevday: 17710565,
          quantityHcPrevday: 15939508,
          quantityDiffToPrevday: 3982,
          quantityHcDiffToPrevday: 3584,
          diffPercent: 0.08,
        },
        {
          cpty: '8997',
          cptyName: 'STATE STREET BANK',
          percentTotalAvail: 17,
          quantity: 16420765,
          quantityHc: 16420765,
          quantityPrevday: 16330502,
          quantityHcPrevday: 16330502,
          quantityDiffToPrevday: 115263,
          quantityHcDiffToPrevday: 115263,
          diffPercent: 0.09,
        },
        {
          cpty: 'A012',
          cptyName: 'ESEC LENDING',
          percentTotalAvail: 16,
          quantity: 7011006,
          quantityHc: 7011006,
          quantityPrevday: 7009380,
          quantityHcPrevday: 7009380,
          quantityDiffToPrevday: 1626,
          quantityHcDiffToPrevday: 1626,
          diffPercent: 0.03,
        },
      ],
      drilldown: [
        {
          category: 'Open',
          activityType: 'SODPosition',
          projected214: -8525,
          settled214: 75,
        },
        {
          category: 'Trade',
          activityType: 'CNS',
          projected214: -11896,
          settled214: -11896,
        },
        {
          category: 'StockBorrow',
          activityType: 'Borrow',
          settled214: 7275,
        },
        {
          category: 'OtherActivities',
          activityType: 'CustodyMoves',
          projected2864: 8600,
          settled2864: 8600,
        },
        {
          category: 'DTCSummary',
          activityType: 'DTCReceives',
          settled2864: 8600,
        },
      ],
    };
  }
}