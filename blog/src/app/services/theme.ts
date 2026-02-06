import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'blog_theme';
  
  public isDarkMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initTheme();
  }

  private initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.THEME_KEY);
      if (saved) {
        this.setDarkMode(saved === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDarkMode(prefersDark);
      }
    }
  }

  toggleTheme(): void {
    this.setDarkMode(!this.isDarkMode);
  }

  private setDarkMode(isDark: boolean): void {
    this.isDarkMode = isDark;
    
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem(this.THEME_KEY, 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem(this.THEME_KEY, 'light');
      }
    }
  }
}