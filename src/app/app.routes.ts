// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/inventory/inventory.routes')
        .then(m => m.INVENTORY_ROUTES),
  },
  {
    path: 'single-name/:ticker',
    loadChildren: () =>
      import('./features/single-name/single-name.routes')
        .then(m => m.SINGLE_NAME_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];