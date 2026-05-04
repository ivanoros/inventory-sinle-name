import { Component, input } from '@angular/core';
import { FeePoint, SingleNameSidebarData } from '../../models/single-name.model';
import { SingleNameFeesChartComponent } from '../single-name-fees-chart/single-name-fees-chart.component';

@Component({
  selector: 'app-single-name-sidebar',
  standalone: true,
  imports: [SingleNameFeesChartComponent],
  templateUrl: './single-name-sidebar.component.html',
  styleUrl: './single-name-sidebar.component.scss',
})
export class SingleNameSidebarComponent {
  readonly fees = input.required<FeePoint[]>();
  readonly sidebar = input.required<SingleNameSidebarData>();
}
