// src/app/features/inventory/models/inventory-row.model.ts
export interface InventoryRow {
  status: string;
  ticker: string;
  cusip: string;
  description: string;
  type: string;
  price: number;
  openingCA?: number;
  recordDate?: string;
  excessDeficit?: number;
  liveExcessDeficit?: number;
  sodBorrowNeed?: number;
  sodExcessReturn?: number;
  sod214Proj?: number;
  sodAfrProj?: number;
  sodUsPmProj?: number;
  sodOtherProj?: number;
  settled214?: number;
  settledAfr?: number;
  settledUsPm?: number;
  otherSettled?: number;
  pending214?: number;
  pendingAfr?: number;
  pendingUsPm?: number;
  pendingOther?: number;
}
