import { Component, input, output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, Module as AgGridModule } from 'ag-grid-community';
import { DrilldownRow } from '../../../../core/models/single-name.model';

@Component({
  selector: 'app-position-panel',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './position-panel.component.html',
  styleUrl: './position-panel.component.scss',
})
export class PositionPanelComponent {
  readonly agGridModules = input.required<AgGridModule[]>();
  readonly drilldownRows = input.required<DrilldownRow[]>();
  readonly drilldownColumnDefs = input.required<ColDef[]>();
  readonly gridOptions = input.required<GridOptions>();
  readonly drilldownVisible = input.required<boolean>();
  readonly showOptions = input.required<boolean>();

  readonly drilldownToggled = output<void>();
  readonly optionsToggled = output<void>();
}
