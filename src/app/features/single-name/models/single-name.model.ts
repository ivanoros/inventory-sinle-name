// src/app/features/single-name/models/single-name.model.ts
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
  position: PositionPanelData;
  sidebar: SingleNameSidebarData;
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

export interface PositionPanelData {
  valuationModes: string[];
  activeValuationMode: string;
  toolbarOptions: ToggleOption[];
  columns: string[];
  rows: PositionSummaryRow[];
  optionMenuItems: ToggleOption[];
  drilldownFilters: ToggleOption[];
}

export interface ToggleOption {
  label: string;
  checked: boolean;
}

export interface PositionSummaryRow {
  label: string;
  values: Array<number | null>;
}

export interface SingleNameSidebarData {
  feeStats: MetricItem[];
  stats: MetricItem[];
  overborrows: MetricItem[];
}

export interface MetricItem {
  label: string;
  value: string;
}
