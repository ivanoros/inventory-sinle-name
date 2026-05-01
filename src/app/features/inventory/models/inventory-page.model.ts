import { InventoryRow } from './inventory-row.model';

export interface InventoryPageRequest {
  pageIndex: number;
  pageSize: number;
}

export interface InventoryPage {
  rows: InventoryRow[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}
