// theme-toggle.component.ts
import { Component, signal, effect } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button class="theme-toggle-btn" (click)="toggle()">
      <span class="icon" [class.active]="!isDark()">
        {{ isDark() ? '🌙' : '🌞' }}
      </span>
    </button>
  `,
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  isDark = signal<boolean>(localStorage.getItem('theme') === 'dark');

  constructor(private overlay: OverlayContainer) {}

  private themeEffect = effect(() => {
    const dark = this.isDark();
    const theme = dark ? 'dark' : 'light';

    // збереження у localStorage
    localStorage.setItem('theme', theme);

    // виставляємо data-theme на <html>
    document.documentElement.setAttribute('data-theme', theme);

    // прибираємо старі класи у body (якщо залишилися)
    document.body.classList.remove('dark-theme', 'light-theme');

    // оновлюємо theme у cdk-overlay-container
    const overlayContainer = this.overlay.getContainerElement();
    overlayContainer.setAttribute('data-theme', theme);
  });

  toggle() {
    this.isDark.set(!this.isDark());
  }
}
