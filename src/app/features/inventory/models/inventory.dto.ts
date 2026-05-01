export interface InventoryPageDto {
  items: InventoryRowDto[];
  total_count: number;
  page_index: number;
  page_size: number;
}

export interface InventoryRowDto {
  sod_excess_deficit_status: string;
  bbg: string;
  cusip: string;
  description: string;
  security_type: string;
  price: number;
  opening_ca?: number;
  record_date?: string;
  excess_deficit?: number;
  live_excess_deficit?: number;
  sod_borrow_need?: number;
  sod_excess_return?: number;
  sod_214_proj?: number;
  sod_afr_proj?: number;
  sod_uspm_proj?: number;
  sod_other_proj?: number;
  settled_214?: number;
  settled_afr?: number;
  settled_uspm?: number;
  other_settled?: number;
  pending_214?: number;
  pending_afr?: number;
  pending_uspm?: number;
  pending_other?: number;
}
