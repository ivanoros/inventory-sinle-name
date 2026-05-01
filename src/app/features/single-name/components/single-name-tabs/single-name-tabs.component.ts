import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-name-tabs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './single-name-tabs.component.html',
  styleUrl: './single-name-tabs.component.scss',
})
export class SingleNameTabsComponent {
  readonly activeTicker = input.required<string>();
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
