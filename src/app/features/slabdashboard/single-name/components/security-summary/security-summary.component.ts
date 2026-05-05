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

  valueClass(value: number): string {
    if (value > 0) return 'positive-value';
    if (value < 0) return 'negative-value';
    return '';
  }

  corporateActionClass(value: string): string {
    if (/-\s*\$?\d/.test(value)) return 'negative-value';
    if (/\+\s*\$?\d/.test(value)) return 'positive-value';
    return '';
  }

  corporateActionDate(value: string): string {
    const dividendStart = value.indexOf('(');
    return dividendStart === -1 ? value : value.slice(0, dividendStart).trim();
  }

  corporateActionDividend(value: string): string {
    const dividendStart = value.indexOf('(');
    return dividendStart === -1 ? '' : value.slice(dividendStart);
  }

  formatNumber(value: number): string {
    if (value === 0) return '-';

    const formattedValue = Math.abs(value).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    return value < 0 ? `-${formattedValue}` : formattedValue;
  }
}
