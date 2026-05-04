// src/app/features/slabdashboard/inventory/inventory.routes.ts
import { Routes } from '@angular/router';
import { InventoryPage } from './pages/inventory-page/inventory-page';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: InventoryPage,
  },
];
