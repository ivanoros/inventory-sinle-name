import { Component, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridOptions,
  ICellRendererParams,
  Module as AgGridModule,
  ValueFormatterParams,
} from 'ag-grid-community';
import { LenderAvailabilityRow } from '../../models/single-name.model';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';

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
    this.numberColumn('quantity', 'QUANTITY', 130),
    this.numberColumn('quantityHc', 'QUANTITY_HC', 130),
    this.numberColumn('quantityPrevday', 'QUANTITY_PREVDAY', 160),
    this.numberColumn('quantityHcPrevday', 'QUANTITY_HC_PREVDAY', 180),
    this.numberColumn('quantityDiffToPrevday', 'QUANTITY_DIFF_TO_PREVDAY', 220),
    this.numberColumn('quantityHcDiffToPrevday', 'QUANTITY_HC_DIFF_TO_PREVDAY', 230),
    this.numberColumn('diffPercent', 'Diff %', 100),
  ];

  private numberColumn(field: keyof LenderAvailabilityRow, headerName: string, width: number): ColDef<LenderAvailabilityRow> {
    return {
      field,
      headerName,
      width,
      filter: 'agNumberColumnFilter',
      cellClass: 'numeric-cell',
      headerClass: 'numeric-header',
      valueFormatter: params => this.formatNumericValue(params),
    };
  }

  private formatNumericValue(params: ValueFormatterParams<LenderAvailabilityRow, number>): string {
    if (params.value === null || params.value === undefined) return '';
    if (params.value === 0) return '-';

    const formattedValue = Math.abs(params.value).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    return params.value < 0 ? `-${formattedValue}` : formattedValue;
  }
}
