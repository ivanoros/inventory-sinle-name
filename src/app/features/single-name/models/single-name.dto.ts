export interface SingleNameDetailDto {
  ticker: string;
  security_id: string;
  name: string;
  country: string;
  cusip: string;
  sector: string;
  security_type: string;
  price: number;
  corporate_action: string;
  net_pnl: number;
  pnl_opp: number;
  watch_list: string;
  lender_total: string;
  daily_change: string;
  position: PositionPanelDto;
  sidebar: SingleNameSidebarDto;
  fees: FeePointDto[];
  lender_availability: LenderAvailabilityRowDto[];
  drilldown: DrilldownRowDto[];
}

export interface FeePointDto {
  period: string;
  value: number;
}

export interface LenderAvailabilityRowDto {
  cpty: string;
  cpty_name: string;
  percent_total_avail: number;
  quantity: number;
  quantity_hc: number;
  quantity_prevday: number;
  quantity_hc_prevday: number;
  quantity_diff_to_prevday: number;
  quantity_hc_diff_to_prevday: number;
  diff_percent: number;
}

export interface DrilldownRowDto {
  category: string;
  activity_type: string;
  projected_214?: number;
  settled_214?: number;
  pending_214?: number;
  projected_2864?: number;
  settled_2864?: number;
  pending_2864?: number;
}

export interface PositionPanelDto {
  valuation_modes: string[];
  active_valuation_mode: string;
  toolbar_options: ToggleOptionDto[];
  columns: string[];
  rows: PositionSummaryRowDto[];
  option_menu_items: ToggleOptionDto[];
  drilldown_filters: ToggleOptionDto[];
}

export interface ToggleOptionDto {
  label: string;
  checked: boolean;
}

export interface PositionSummaryRowDto {
  label: string;
  values: Array<number | null>;
}

export interface SingleNameSidebarDto {
  fee_stats: MetricItemDto[];
  stats: MetricItemDto[];
  overborrows: MetricItemDto[];
}

export interface MetricItemDto {
  label: string;
  value: string;
}
