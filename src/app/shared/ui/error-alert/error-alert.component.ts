import { Component, input } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [MessageModule],
  templateUrl: './error-alert.component.html',
})
export class ErrorAlertComponent {
  message = input.required<string>();
}
