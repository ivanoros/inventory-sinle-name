import { Component, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, ICellRendererParams, Module as AgGridModule } from 'ag-grid-community';
import { LenderAvailabilityRow } from '../../models/single-name.model';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-lender-availability',
  standalone: true,
  imports: [AgGridAngular, EmptyStateComponent],
  templateUrl: './lender-availability.component.html',
  styleUrl: './lender-availability.component.scss',
})
export class LenderAvailabilityComponent {
  readonly agGridModules = input.required<AgGridModule[]>();
  readonly rows = input.required<LenderAvailabilityRow[]>();
  readonly lenderTotal = input.required<string>();
  readonly dailyChange = input.required<string>();
  readonly gridOptions = input.required<GridOptions>();

  readonly columnDefs: ColDef<LenderAvailabilityRow>[] = [
    { field: 'cpty', headerName: 'CPTY', width: 90 },
    { field: 'cptyName', headerName: 'CPTY_NAME', width: 230 },
    {
      field: 'percentTotalAvail',
      headerName: '% TOTAL AVAIL',
      width: 160,
      cellRenderer: (params: ICellRendererParams<LenderAvailabilityRow, number>) => {
        const value = Number(params.value ?? 0);
        return `
          <div class="bar-cell">
            <div class="bar-fill" style="width:${value}%"></div>
            <span>${value}%</span>
          </div>
        `;
      },
    },
    { field: 'quantity', headerName: 'QUANTITY', width: 130 },
    { field: 'quantityHc', headerName: 'QUANTITY_HC', width: 130 },
    { field: 'quantityPrevday', headerName: 'QUANTITY_PREVDAY', width: 160 },
    { field: 'quantityHcPrevday', headerName: 'QUANTITY_HC_PREVDAY', width: 180 },
    { field: 'quantityDiffToPrevday', headerName: 'QUANTITY_DIFF_TO_PREVDAY', width: 220 },
    { field: 'quantityHcDiffToPrevday', headerName: 'QUANTITY_HC_DIFF_TO_PREVDAY', width: 230 },
    { field: 'diffPercent', headerName: 'Diff %', width: 100 },
  ];
}
