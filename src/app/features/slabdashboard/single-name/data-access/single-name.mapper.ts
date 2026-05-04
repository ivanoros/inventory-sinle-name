import {
  DrilldownRow,
  FeePoint,
  LenderAvailabilityRow,
  MetricItem,
  PositionPanelData,
  PositionSummaryRow,
  SingleNameDetail,
  SingleNameSidebarData,
  ToggleOption,
} from '../models/single-name.model';
import {
  DrilldownRowDto,
  FeePointDto,
  LenderAvailabilityRowDto,
  MetricItemDto,
  PositionPanelDto,
  PositionSummaryRowDto,
  SingleNameDetailDto,
  SingleNameSidebarDto,
  ToggleOptionDto,
} from '../models/single-name.dto';

export function mapSingleNameDetailDto(dto: SingleNameDetailDto): SingleNameDetail {
  return {
    ticker: dto.ticker,
    securityId: dto.security_id,
    name: dto.name,
    country: dto.country,
    cusip: dto.cusip,
    sector: dto.sector,
    type: dto.security_type,
    price: dto.price,
    corporateAction: dto.corporate_action,
    netPnl: dto.net_pnl,
    pnlOpp: dto.pnl_opp,
    watchList: dto.watch_list,
    lenderTotal: dto.lender_total,
    dailyChange: dto.daily_change,
    position: mapPositionPanelDto(dto.position),
    sidebar: mapSingleNameSidebarDto(dto.sidebar),
    fees: dto.fees.map(mapFeePointDto),
    lenderAvailability: dto.lender_availability.map(mapLenderAvailabilityRowDto),
    drilldown: dto.drilldown.map(mapDrilldownRowDto),
  };
}

export function mapSingleNameDetailToDto(detail: SingleNameDetail): SingleNameDetailDto {
  return {
    ticker: detail.ticker,
    security_id: detail.securityId,
    name: detail.name,
    country: detail.country,
    cusip: detail.cusip,
    sector: detail.sector,
    security_type: detail.type,
    price: detail.price,
    corporate_action: detail.corporateAction,
    net_pnl: detail.netPnl,
    pnl_opp: detail.pnlOpp,
    watch_list: detail.watchList,
    lender_total: detail.lenderTotal,
    daily_change: detail.dailyChange,
    position: mapPositionPanelToDto(detail.position),
    sidebar: mapSingleNameSidebarToDto(detail.sidebar),
    fees: detail.fees.map(mapFeePointToDto),
    lender_availability: detail.lenderAvailability.map(mapLenderAvailabilityRowToDto),
    drilldown: detail.drilldown.map(mapDrilldownRowToDto),
  };
}

function mapFeePointDto(dto: FeePointDto): FeePoint {
  return {
    period: dto.period,
    value: dto.value,
  };
}

function mapFeePointToDto(fee: FeePoint): FeePointDto {
  return {
    period: fee.period,
    value: fee.value,
  };
}

function mapLenderAvailabilityRowDto(dto: LenderAvailabilityRowDto): LenderAvailabilityRow {
  return {
    cpty: dto.cpty,
    cptyName: dto.cpty_name,
    percentTotalAvail: dto.percent_total_avail,
    quantity: dto.quantity,
    quantityHc: dto.quantity_hc,
    quantityPrevday: dto.quantity_prevday,
    quantityHcPrevday: dto.quantity_hc_prevday,
    quantityDiffToPrevday: dto.quantity_diff_to_prevday,
    quantityHcDiffToPrevday: dto.quantity_hc_diff_to_prevday,
    diffPercent: dto.diff_percent,
  };
}

function mapLenderAvailabilityRowToDto(row: LenderAvailabilityRow): LenderAvailabilityRowDto {
  return {
    cpty: row.cpty,
    cpty_name: row.cptyName,
    percent_total_avail: row.percentTotalAvail,
    quantity: row.quantity,
    quantity_hc: row.quantityHc,
    quantity_prevday: row.quantityPrevday,
    quantity_hc_prevday: row.quantityHcPrevday,
    quantity_diff_to_prevday: row.quantityDiffToPrevday,
    quantity_hc_diff_to_prevday: row.quantityHcDiffToPrevday,
    diff_percent: row.diffPercent,
  };
}

function mapDrilldownRowDto(dto: DrilldownRowDto): DrilldownRow {
  return {
    category: dto.category,
    activityType: dto.activity_type,
    market: dto.market,
    account: dto.account,
    description: dto.description,
    isEmpty: dto.is_empty,
    isNonEntitlement: dto.is_non_entitlement,
    projected214: dto.projected_214,
    settled214: dto.settled_214,
    pending214: dto.pending_214,
    projected2864: dto.projected_2864,
    settled2864: dto.settled_2864,
    pending2864: dto.pending_2864,
    projectedTotal: dto.projected_total,
    settledTotal: dto.settled_total,
    pendingTotal: dto.pending_total,
  };
}

function mapDrilldownRowToDto(row: DrilldownRow): DrilldownRowDto {
  return {
    category: row.category,
    activity_type: row.activityType,
    market: row.market,
    account: row.account,
    description: row.description,
    is_empty: row.isEmpty,
    is_non_entitlement: row.isNonEntitlement,
    projected_214: row.projected214,
    settled_214: row.settled214,
    pending_214: row.pending214,
    projected_2864: row.projected2864,
    settled_2864: row.settled2864,
    pending_2864: row.pending2864,
    projected_total: row.projectedTotal,
    settled_total: row.settledTotal,
    pending_total: row.pendingTotal,
  };
}

function mapPositionPanelDto(dto: PositionPanelDto): PositionPanelData {
  return {
    valuationModes: dto.valuation_modes,
    activeValuationMode: dto.active_valuation_mode,
    toolbarOptions: dto.toolbar_options.map(mapToggleOptionDto),
    columns: dto.columns,
    rows: dto.rows.map(mapPositionSummaryRowDto),
    optionMenuItems: dto.option_menu_items.map(mapToggleOptionDto),
    drilldownFilters: dto.drilldown_filters.map(mapToggleOptionDto),
  };
}

function mapPositionPanelToDto(position: PositionPanelData): PositionPanelDto {
  return {
    valuation_modes: position.valuationModes,
    active_valuation_mode: position.activeValuationMode,
    toolbar_options: position.toolbarOptions.map(mapToggleOptionToDto),
    columns: position.columns,
    rows: position.rows.map(mapPositionSummaryRowToDto),
    option_menu_items: position.optionMenuItems.map(mapToggleOptionToDto),
    drilldown_filters: position.drilldownFilters.map(mapToggleOptionToDto),
  };
}

function mapToggleOptionDto(dto: ToggleOptionDto): ToggleOption {
  return {
    label: dto.label,
    checked: dto.checked,
  };
}

function mapToggleOptionToDto(option: ToggleOption): ToggleOptionDto {
  return {
    label: option.label,
    checked: option.checked,
  };
}

function mapPositionSummaryRowDto(dto: PositionSummaryRowDto): PositionSummaryRow {
  return {
    label: dto.label,
    values: dto.values,
  };
}

function mapPositionSummaryRowToDto(row: PositionSummaryRow): PositionSummaryRowDto {
  return {
    label: row.label,
    values: row.values,
  };
}

function mapSingleNameSidebarDto(dto: SingleNameSidebarDto): SingleNameSidebarData {
  return {
    feeStats: dto.fee_stats.map(mapMetricItemDto),
    stats: dto.stats.map(mapMetricItemDto),
    overborrows: dto.overborrows.map(mapMetricItemDto),
  };
}

function mapSingleNameSidebarToDto(sidebar: SingleNameSidebarData): SingleNameSidebarDto {
  return {
    fee_stats: sidebar.feeStats.map(mapMetricItemToDto),
    stats: sidebar.stats.map(mapMetricItemToDto),
    overborrows: sidebar.overborrows.map(mapMetricItemToDto),
  };
}

function mapMetricItemDto(dto: MetricItemDto): MetricItem {
  return {
    label: dto.label,
    value: dto.value,
  };
}

function mapMetricItemToDto(item: MetricItem): MetricItemDto {
  return {
    label: item.label,
    value: item.value,
  };
}
