import { InventoryRow } from './inventory-row.model';

export type InventoryViewFilter = 'sod' | 'live' | 'gc' | 'warm' | 'htb' | 'special';

export interface InventorySort {
  field: keyof InventoryRow;
  direction: 'asc' | 'desc';
}

export interface InventoryPageRequest {
  pageIndex: number;
  pageSize: number;
  view?: InventoryViewFilter;
  sorts?: InventorySort[];
}

export interface InventoryPage {
  rows: InventoryRow[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}
