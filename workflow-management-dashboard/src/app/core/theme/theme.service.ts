import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'wmd_theme';

  init(): void {
    const saved = localStorage.getItem(this.key);
    if (saved === 'dark') this.setDark(true);
  }

  isDark(): boolean {
    return document.body.classList.contains('wmd-dark');
  }

  toggle(): void {
    this.setDark(!this.isDark());
  }

  setDark(dark: boolean): void {
    document.body.classList.toggle('wmd-dark', dark);
    localStorage.setItem(this.key, dark ? 'dark' : 'light');
  }
}

