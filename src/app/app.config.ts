import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { apiBaseUrlInterceptor } from '@core/http/api-base-url.interceptor';
import { httpErrorInterceptor } from '@core/http/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.slabdashboard-dark',
        },
      },
    }),
    provideHttpClient(
      withInterceptors([
        apiBaseUrlInterceptor,
        httpErrorInterceptor,
      ]),
    ),
  ]
};
