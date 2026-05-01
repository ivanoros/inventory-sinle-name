import { InventoryPage } from '../models/inventory-page.model';
import { InventoryRow } from '../models/inventory-row.model';
import { InventoryPageDto, InventoryRowDto } from '../models/inventory.dto';

export function mapInventoryPageDto(dto: InventoryPageDto): InventoryPage {
  return {
    rows: dto.items.map(mapInventoryRowDto),
    totalCount: dto.total_count,
    pageIndex: dto.page_index,
    pageSize: dto.page_size,
  };
}

export function mapInventoryRowDto(dto: InventoryRowDto): InventoryRow {
  return {
    status: dto.sod_excess_deficit_status,
    ticker: dto.bbg,
    cusip: dto.cusip,
    description: dto.description,
    type: dto.security_type,
    price: dto.price,
    openingCA: dto.opening_ca,
    recordDate: dto.record_date,
    excessDeficit: dto.excess_deficit,
    liveExcessDeficit: dto.live_excess_deficit,
    sodBorrowNeed: dto.sod_borrow_need,
    sodExcessReturn: dto.sod_excess_return,
    sod214Proj: dto.sod_214_proj,
    sodAfrProj: dto.sod_afr_proj,
    sodUsPmProj: dto.sod_uspm_proj,
    sodOtherProj: dto.sod_other_proj,
    settled214: dto.settled_214,
    settledAfr: dto.settled_afr,
    settledUsPm: dto.settled_uspm,
    otherSettled: dto.other_settled,
    pending214: dto.pending_214,
    pendingAfr: dto.pending_afr,
    pendingUsPm: dto.pending_uspm,
    pendingOther: dto.pending_other,
  };
}

export function mapInventoryPageToDto(page: InventoryPage): InventoryPageDto {
  return {
    items: page.rows.map(mapInventoryRowToDto),
    total_count: page.totalCount,
    page_index: page.pageIndex,
    page_size: page.pageSize,
  };
}

function mapInventoryRowToDto(row: InventoryRow): InventoryRowDto {
  return {
    sod_excess_deficit_status: row.status,
    bbg: row.ticker,
    cusip: row.cusip,
    description: row.description,
    security_type: row.type,
    price: row.price,
    opening_ca: row.openingCA,
    record_date: row.recordDate,
    excess_deficit: row.excessDeficit,
    live_excess_deficit: row.liveExcessDeficit,
    sod_borrow_need: row.sodBorrowNeed,
    sod_excess_return: row.sodExcessReturn,
    sod_214_proj: row.sod214Proj,
    sod_afr_proj: row.sodAfrProj,
    sod_uspm_proj: row.sodUsPmProj,
    sod_other_proj: row.sodOtherProj,
    settled_214: row.settled214,
    settled_afr: row.settledAfr,
    settled_uspm: row.settledUsPm,
    other_settled: row.otherSettled,
    pending_214: row.pending214,
    pending_afr: row.pendingAfr,
    pending_uspm: row.pendingUsPm,
    pending_other: row.pendingOther,
  };
}
