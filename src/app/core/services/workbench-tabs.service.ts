import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkbenchTabsService {
  private readonly securityTabsSignal = signal<string[]>([]);

  readonly securityTabs = this.securityTabsSignal.asReadonly();

  openSecurity(ticker: string): string {
    const normalizedTicker = ticker.trim().toUpperCase();
    if (!normalizedTicker) return normalizedTicker;

    this.securityTabsSignal.update(tabs =>
      tabs.includes(normalizedTicker) ? tabs : [...tabs, normalizedTicker],
    );

    return normalizedTicker;
  }
}
