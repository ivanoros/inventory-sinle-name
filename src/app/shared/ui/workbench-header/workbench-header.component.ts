import { Component, inject } from '@angular/core';
import { WorkbenchThemeService } from '@core/services/workbench-theme.service';

@Component({
  selector: 'app-workbench-header',
  standalone: true,
  templateUrl: './workbench-header.component.html',
  styleUrl: './workbench-header.component.css',
})
export class WorkbenchHeaderComponent {
  readonly theme = inject(WorkbenchThemeService);
}
