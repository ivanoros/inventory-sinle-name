import { Component, input } from '@angular/core';
import { SingleNameDetail } from '../../models/single-name.model';

@Component({
  selector: 'app-security-summary',
  standalone: true,
  templateUrl: './security-summary.component.html',
  styleUrl: './security-summary.component.scss',
})
export class SecuritySummaryComponent {
  readonly detail = input.required<SingleNameDetail>();
}
