import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

type WorkbenchTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class WorkbenchThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'workbench-theme';
  private readonly theme = signal<WorkbenchTheme>(this.getInitialTheme());

  readonly isDark = computed(() => this.theme() === 'dark');
  readonly toggleLabel = computed(() => this.isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  readonly toggleIcon = computed(() => this.isDark() ? '☀' : '☾');

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme: WorkbenchTheme = this.isDark() ? 'light' : 'dark';

    this.theme.set(nextTheme);
    localStorage.setItem(this.storageKey, nextTheme);
    this.applyTheme(nextTheme);
  }

  private getInitialTheme(): WorkbenchTheme {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: WorkbenchTheme): void {
    this.document.body.classList.toggle('workbench-dark', theme === 'dark');
  }
}
