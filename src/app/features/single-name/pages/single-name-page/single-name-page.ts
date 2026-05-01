// src/app/features/single-name/pages/single-name-page/single-name-page.ts
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, startWith, switchMap } from 'rxjs';
import { AllCommunityModule as AllGridCommunityModule, ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule as AllChartCommunityModule, ModuleRegistry as ChartModuleRegistry } from 'ag-charts-community';
import { TradingDataService } from '../../../../core/services/trading-data.service';
import { WorkbenchTabsService } from '../../../../core/services/workbench-tabs.service';
import { SingleNameTabsComponent } from '../../components/single-name-tabs/single-name-tabs.component';
import { SecuritySummaryComponent } from '../../components/security-summary/security-summary.component';
import { PositionPanelComponent } from '../../components/position-panel/position-panel.component';
import { LenderAvailabilityComponent } from '../../components/lender-availability/lender-availability.component';
import { SingleNameSidebarComponent } from '../../components/single-name-sidebar/single-name-sidebar.component';

ChartModuleRegistry.registerModules(AllChartCommunityModule);

@Component({
  selector: 'app-single-name',
  standalone: true,
  imports: [
    SingleNameTabsComponent,
    SecuritySummaryComponent,
    PositionPanelComponent,
    LenderAvailabilityComponent,
    SingleNameSidebarComponent,
  ],
  templateUrl: './single-name-page.html',
  styleUrl: './single-name-page.scss',
})
export class SingleNamePage {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataService = inject(TradingDataService);
  private readonly tabsService = inject(WorkbenchTabsService);

  readonly ticker = signal(this.route.snapshot.paramMap.get('ticker') ?? 'FULT');
  readonly securityTabs = this.tabsService.securityTabs;
  readonly drilldownVisible = signal(false);
  readonly showOptions = signal(false);

  readonly agGridModules = [AllGridCommunityModule];
  readonly detail = toSignal(
    toObservable(this.ticker).pipe(
      switchMap(ticker =>
        interval(this.dataService.refreshIntervalMs).pipe(
          startWith(0),
          switchMap(() => this.dataService.getSingleName(ticker)),
        ),
      ),
    ),
    { initialValue: null },
  );
  readonly lenderRows = computed(() => this.detail()?.lenderAvailability ?? []);
  readonly drilldownRows = computed(() => this.detail()?.drilldown ?? []);

  readonly drilldownColumnDefs: ColDef[] = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'activityType', headerName: 'Activity type', width: 160 },
    { field: 'projected214', headerName: '214 Projected', width: 140 },
    { field: 'settled214', headerName: '214 Settled', width: 140 },
    { field: 'pending214', headerName: '214 Pending', width: 140 },
    { field: 'projected2864', headerName: '2864 Projected', width: 140 },
    { field: 'settled2864', headerName: '2864 Settled', width: 140 },
    { field: 'pending2864', headerName: '2864 Pending', width: 140 },
  ];

  readonly gridOptions: GridOptions = {
    theme: 'legacy',
    rowHeight: 30,
    headerHeight: 33,
    suppressCellFocus: true,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
  };

  constructor() {
    this.tabsService.openSecurity(this.ticker());

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const ticker = this.tabsService.openSecurity(params.get('ticker') ?? 'FULT');
        this.ticker.set(ticker);
      });
  }

  toggleDrilldown(): void {
    this.drilldownVisible.update(value => !value);
  }

  toggleOptions(): void {
    this.showOptions.update(value => !value);
  }
}
