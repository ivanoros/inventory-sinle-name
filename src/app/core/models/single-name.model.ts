// src/app/core/models/single-name.model.ts
export interface SingleNameDetail {
  ticker: string;
  securityId: string;
  name: string;
  country: string;
  cusip: string;
  sector: string;
  type: string;
  price: number;
  corporateAction: string;
  netPnl: number;
  pnlOpp: number;
  watchList: string;
  lenderTotal: string;
  dailyChange: string;
  fees: FeePoint[];
  lenderAvailability: LenderAvailabilityRow[];
  drilldown: DrilldownRow[];
}

export interface FeePoint {
  period: string;
  value: number;
}

export interface LenderAvailabilityRow {
  cpty: string;
  cptyName: string;
  percentTotalAvail: number;
  quantity: number;
  quantityHc: number;
  quantityPrevday: number;
  quantityHcPrevday: number;
  quantityDiffToPrevday: number;
  quantityHcDiffToPrevday: number;
  diffPercent: number;
}

export interface DrilldownRow {
  category: string;
  activityType: string;
  projected214?: number;
  settled214?: number;
  pending214?: number;
  projected2864?: number;
  settled2864?: number;
  pending2864?: number;
}