import { Component, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from './features/auth/services/auth.service';

interface NavButton {
  label: string;
  link?: string;
  show: () => boolean;
  action?: () => void;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  currentTheme = signal<'light' | 'dark'>('light');
  isDarkTheme = computed(() => this.currentTheme() === 'dark');
  navButtons: NavButton[] = [];

  private platformId = inject(PLATFORM_ID);
  private overlay = inject(OverlayContainer);

  constructor(public auth: AuthService) {
    // Завантажуємо тему з localStorage (якщо браузер)
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      this.currentTheme.set(saved ?? 'light');
    }

    // Навігаційні кнопки
    this.navButtons = [
      { label: 'Items', link: '/items', show: () => this.auth.isLoggedIn() },
      { label: 'Settings', link: '/settings', show: () => this.auth.isLoggedIn() },
      { label: 'Login', link: '/auth/login', show: () => !this.auth.isLoggedIn() },
      { label: 'Logout', show: () => this.auth.isLoggedIn(), action: () => this.auth.logout() }
    ];

    // Ефект для синхронізації теми
    effect(() => {
      const theme = this.currentTheme();

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', theme);
      }

      // Встановлюємо тему на <html>
      document.documentElement.setAttribute('data-theme', theme);

      // Встановлюємо тему на overlay container (меню, діалоги)
      this.overlay.getContainerElement().setAttribute('data-theme', theme);
    });
  }

  toggleTheme() {
    this.currentTheme.set(this.currentTheme() === 'light' ? 'dark' : 'light');
  }
}
