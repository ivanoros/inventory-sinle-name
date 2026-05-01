// src/app/features/single-name/pages/single-name-page/single-name-page.ts
import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AllCommunityModule as AllGridCommunityModule, ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule as AllChartCommunityModule, ModuleRegistry as ChartModuleRegistry } from 'ag-charts-community';
import { SingleNameTabsComponent } from '../../components/single-name-tabs/single-name-tabs.component';
import { SecuritySummaryComponent } from '../../components/security-summary/security-summary.component';
import { PositionPanelComponent } from '../../components/position-panel/position-panel.component';
import { LenderAvailabilityComponent } from '../../components/lender-availability/lender-availability.component';
import { SingleNameSidebarComponent } from '../../components/single-name-sidebar/single-name-sidebar.component';
import { SingleNameStore } from '../../state/single-name.store';
import { ErrorAlertComponent } from '../../../../shared/ui/error-alert/error-alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';

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
    ErrorAlertComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './single-name-page.html',
  styleUrl: './single-name-page.scss',
  providers: [SingleNameStore],
})
export class SingleNamePage {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly store = inject(SingleNameStore);

  readonly agGridModules = [AllGridCommunityModule];

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
    this.store.setTicker(this.route.snapshot.paramMap.get('ticker'));

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.store.setTicker(params.get('ticker')));
  }

  toggleDrilldown(): void {
    this.store.toggleDrilldown();
  }

  toggleOptions(): void {
    this.store.toggleOptions();
  }

  startSidebarResize(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.store.startSidebarResize(event.clientX);
  }

  resizeSidebar(event: PointerEvent): void {
    this.store.resizeSidebar(event.clientX);
  }

  stopSidebarResize(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    this.store.stopSidebarResize();
  }

  closeSecurityTab(ticker: string): void {
    this.store.closeSecurityTab(ticker);
  }

  closeInventoryTab(): void {
    this.store.closeInventoryTab();
  }
}
