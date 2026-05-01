import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workbench-tabs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './workbench-tabs.component.html',
  styleUrl: './workbench-tabs.component.css',
})
export class WorkbenchTabsComponent {
  readonly activeTab = input.required<'inventory' | string>();
  readonly inventoryTabOpen = input.required<boolean>();
  readonly securityTabs = input.required<string[]>();

  readonly inventoryTabClosed = output<void>();
  readonly securityTabClosed = output<string>();

  closeInventoryTab(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.inventoryTabClosed.emit();
  }

  closeSecurityTab(event: MouseEvent, ticker: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.securityTabClosed.emit(ticker);
  }
}
