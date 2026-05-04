import { Component, inject } from '@angular/core';
import { SlabdashboardThemeService } from '@core/services/slabdashboard-theme.service';

@Component({
  selector: 'app-slabdashboard-header',
  standalone: true,
  templateUrl: './slabdashboard-header.component.html',
  styleUrl: './slabdashboard-header.component.css',
})
export class SlabdashboardHeaderComponent {
  readonly theme = inject(SlabdashboardThemeService);
}
