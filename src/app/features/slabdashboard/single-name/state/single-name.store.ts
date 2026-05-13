import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, Subject, catchError, merge, of, switchMap, tap, timer } from 'rxjs';
import { SlabdashboardTabsService } from '@core/services/slabdashboard-tabs.service';
import { SingleNameDataService } from '../data-access/single-name-data.service';

@Injectable()
export class SingleNameStore {
  private readonly router = inject(Router);
  private readonly singleNameData = inject(SingleNameDataService);
  private readonly tabsService = inject(SlabdashboardTabsService);
  private readonly refreshRequests = new Subject<void>();

  readonly ticker = signal('FULT');
  readonly inventoryTabOpen = this.tabsService.inventoryTabOpen;
  readonly securityTabs = this.tabsService.securityTabs;
  readonly autoRefreshEnabled = signal(false);
  readonly drilldownVisible = signal(false);
  readonly showOptions = signal(false);
  readonly showEmptyDrilldownRows = signal(false);
  readonly includeNonEntitlement = signal(false);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly sidebarWidth = signal(320);
  readonly resizingSidebar = signal(false);
  private resizeStartX = 0;
  private resizeStartWidth = 320;
  private readonly autoRefreshEnabled$ = toObservable(this.autoRefreshEnabled);

  readonly detail = toSignal(
    toObservable(this.ticker).pipe(
      switchMap(ticker =>
        merge(
          of(undefined),
          this.refreshRequests,
          this.autoRefreshEnabled$.pipe(
            switchMap(enabled => enabled
              ? timer(this.singleNameData.refreshIntervalMs, this.singleNameData.refreshIntervalMs)
              : EMPTY),
          ),
        ).pipe(
          tap(() => {
            this.loading.set(true);
            this.error.set(null);
          }),
          switchMap(() =>
            this.singleNameData.getSingleName(ticker).pipe(
              tap(() => this.loading.set(false)),
              catchError(() => {
                this.loading.set(false);
                this.error.set('Unable to load single name data.');
                return of(null);
              }),
            ),
          ),
        ),
      ),
    ),
    { initialValue: null },
  );
  readonly lenderRows = computed(() => this.detail()?.lenderAvailability ?? []);
  readonly drilldownRows = computed(() => {
    const rows = this.detail()?.drilldown ?? [];

    return rows.filter(row => {
      if (!this.showEmptyDrilldownRows() && row.isEmpty) return false;
      if (!this.includeNonEntitlement() && row.isNonEntitlement) return false;

      return true;
    });
  });

  setTicker(ticker: string | null, options: { openTab?: boolean } = {}): void {
    const requestedTicker = (ticker ?? 'FULT').trim().toUpperCase() || 'FULT';
    const openedTicker = options.openTab === false
      ? requestedTicker
      : this.tabsService.openSecurity(requestedTicker);

    this.ticker.set(openedTicker || 'FULT');
  }

  toggleDrilldown(): void {
    this.drilldownVisible.update(value => !value);
  }

  toggleOptions(): void {
    this.showOptions.update(value => !value);
  }

  setShowEmptyDrilldownRows(checked: boolean): void {
    this.showEmptyDrilldownRows.set(checked);
  }

  setIncludeNonEntitlement(checked: boolean): void {
    this.includeNonEntitlement.set(checked);
  }

  refreshFromBackend(): void {
    this.refreshRequests.next();
  }

  startRefreshTimer(): void {
    this.autoRefreshEnabled.set(true);
  }

  stopRefreshTimer(): void {
    this.autoRefreshEnabled.set(false);
  }

  toggleRefreshTimer(): void {
    this.autoRefreshEnabled.update(enabled => !enabled);
  }

  startSidebarResize(pointerX: number): void {
    this.resizeStartX = pointerX;
    this.resizeStartWidth = this.sidebarWidth();
    this.resizingSidebar.set(true);
  }

  resizeSidebar(pointerX: number): void {
    if (!this.resizingSidebar()) return;

    const nextWidth = this.resizeStartWidth + this.resizeStartX - pointerX;
    this.sidebarWidth.set(Math.min(760, Math.max(260, nextWidth)));
  }

  stopSidebarResize(): void {
    this.resizingSidebar.set(false);
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
