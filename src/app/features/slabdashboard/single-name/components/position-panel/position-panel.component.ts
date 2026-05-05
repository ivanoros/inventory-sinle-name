import { Component, input, output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, Module as AgGridModule } from 'ag-grid-community';
import { DrilldownRow, PositionPanelData } from '../../models/single-name.model';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-position-panel',
  standalone: true,
  imports: [AgGridAngular, EmptyStateComponent],
  templateUrl: './position-panel.component.html',
  styleUrl: './position-panel.component.scss',
})
export class PositionPanelComponent {
  readonly position = input.required<PositionPanelData>();
  readonly agGridModules = input.required<AgGridModule[]>();
  readonly drilldownRows = input.required<DrilldownRow[]>();
  readonly drilldownColumnDefs = input.required<ColDef[]>();
  readonly gridOptions = input.required<GridOptions>();
  readonly drilldownVisible = input.required<boolean>();
  readonly showOptions = input.required<boolean>();
  readonly showEmptyRows = input.required<boolean>();
  readonly includeNonEntitlement = input.required<boolean>();

  readonly drilldownToggled = output<void>();
  readonly optionsToggled = output<void>();
  readonly showEmptyRowsChanged = output<boolean>();
  readonly includeNonEntitlementChanged = output<boolean>();

  formatValue(value: number | null): string {
    if (value === null) return '';

    const formattedValue = Math.abs(value).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    return value < 0 ? `-${formattedValue}` : formattedValue;
  }

  updateShowEmptyRows(event: Event): void {
    this.showEmptyRowsChanged.emit((event.target as HTMLInputElement).checked);
  }

  updateIncludeNonEntitlement(event: Event): void {
    this.includeNonEntitlementChanged.emit((event.target as HTMLInputElement).checked);
  }
}
