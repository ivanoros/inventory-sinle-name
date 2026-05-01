import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-name-tabs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './single-name-tabs.component.html',
  styleUrl: './single-name-tabs.component.scss',
})
export class SingleNameTabsComponent {
  readonly activeTicker = input.required<string>();
  readonly securityTabs = input.required<string[]>();
}
