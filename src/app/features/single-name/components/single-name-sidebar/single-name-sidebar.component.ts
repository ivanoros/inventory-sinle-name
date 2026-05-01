import { Component, computed, input } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgCartesianChartOptions } from 'ag-charts-community';
import { FeePoint } from '../../../../core/models/single-name.model';

@Component({
  selector: 'app-single-name-sidebar',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './single-name-sidebar.component.html',
  styleUrl: './single-name-sidebar.component.scss',
})
export class SingleNameSidebarComponent {
  readonly fees = input.required<FeePoint[]>();

  readonly chartOptions = computed<AgCartesianChartOptions>(() => ({
    data: this.fees(),
    height: 210,
    title: {
      text: 'Lending Pit',
    },
    series: [
      {
        type: 'line',
        xKey: 'period',
        yKey: 'value',
        marker: {
          enabled: true,
        },
      },
    ],
    axes: {
      x: {
        type: 'category',
        position: 'bottom',
      },
      y: {
        type: 'number',
        position: 'left',
      },
    },
  }));
}
