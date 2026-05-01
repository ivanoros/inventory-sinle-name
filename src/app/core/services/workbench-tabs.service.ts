import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkbenchTabsService {
  private readonly inventoryTabOpenSignal = signal(true);
  private readonly securityTabsSignal = signal<string[]>([]);

  readonly inventoryTabOpen = this.inventoryTabOpenSignal.asReadonly();
  readonly securityTabs = this.securityTabsSignal.asReadonly();

  openInventory(): void {
    this.inventoryTabOpenSignal.set(true);
  }

  closeInventory(): string | null {
    const nextTicker = this.securityTabsSignal()[0] ?? null;
    this.inventoryTabOpenSignal.set(false);

    if (!nextTicker) {
      this.openInventory();
    }

    return nextTicker;
  }

  openSecurity(ticker: string): string {
    const normalizedTicker = ticker.trim().toUpperCase();
    if (!normalizedTicker) return normalizedTicker;

    this.securityTabsSignal.update(tabs =>
      tabs.includes(normalizedTicker) ? tabs : [...tabs, normalizedTicker],
    );

    return normalizedTicker;
  }

  closeSecurity(ticker: string): string | null {
    const normalizedTicker = ticker.trim().toUpperCase();
    const tabs = this.securityTabsSignal();
    const closedTabIndex = tabs.indexOf(normalizedTicker);
    if (closedTabIndex === -1) return tabs[0] ?? null;

    const nextTabs = tabs.filter(tab => tab !== normalizedTicker);
    this.securityTabsSignal.set(nextTabs);

    return nextTabs[closedTabIndex] ?? nextTabs[closedTabIndex - 1] ?? null;
  }
}
