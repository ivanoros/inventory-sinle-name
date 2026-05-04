import { Component, computed, input } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgCartesianChartOptions } from 'ag-charts-community';
import { FeePoint } from '../../models/single-name.model';

@Component({
  selector: 'app-single-name-fees-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './single-name-fees-chart.component.html',
  styleUrl: './single-name-fees-chart.component.scss',
})
export class SingleNameFeesChartComponent {
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
