import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { WorkbenchTabsService } from '../../../core/services/workbench-tabs.service';
import { SingleNameDataService } from '../data-access/single-name-data.service';

@Injectable()
export class SingleNameStore {
  private readonly router = inject(Router);
  private readonly singleNameData = inject(SingleNameDataService);
  private readonly tabsService = inject(WorkbenchTabsService);

  readonly ticker = signal('FULT');
  readonly inventoryTabOpen = this.tabsService.inventoryTabOpen;
  readonly securityTabs = this.tabsService.securityTabs;
  readonly drilldownVisible = signal(false);
  readonly showOptions = signal(false);

  readonly detail = toSignal(
    toObservable(this.ticker).pipe(
      switchMap(ticker => this.singleNameData.getRefreshedSingleName(ticker)),
    ),
    { initialValue: null },
  );
  readonly lenderRows = computed(() => this.detail()?.lenderAvailability ?? []);
  readonly drilldownRows = computed(() => this.detail()?.drilldown ?? []);

  setTicker(ticker: string | null): void {
    const openedTicker = this.tabsService.openSecurity(ticker ?? 'FULT');
    this.ticker.set(openedTicker);
  }

  toggleDrilldown(): void {
    this.drilldownVisible.update(value => !value);
  }

  toggleOptions(): void {
    this.showOptions.update(value => !value);
  }

  closeSecurityTab(ticker: string): void {
    const nextTicker = this.tabsService.closeSecurity(ticker);

    if (ticker !== this.ticker()) return;

    if (nextTicker) {
      this.router.navigate(['/single-name', nextTicker]);
      return;
    }

    this.router.navigate(['/']);
  }

  closeInventoryTab(): void {
    this.tabsService.closeInventory();
  }
}
