import { Component, OnInit, ViewChild, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbar } from "@angular/material/toolbar";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbar,
    MatButtonModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isDarkTheme = false;
  isMobile = false;

  private renderer = inject(Renderer2);
  private breakpointObserver = inject(BreakpointObserver);
  private platformId = inject(PLATFORM_ID);

  constructor(public auth: AuthService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkTheme = savedTheme === 'dark';
    }
    this.updateBodyClass();

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (!this.isMobile && this.sidenav) {
          this.sidenav.open();
        }
      });
  }

  toggleTheme(isDark: boolean) {
    this.isDarkTheme = isDark;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    this.updateBodyClass();
  }

  closeSidenav() {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }

  private updateBodyClass() {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    if (this.isDarkTheme) {
      this.renderer.addClass(body, 'dark-theme');
      this.renderer.removeClass(body, 'light-theme');
    } else {
      this.renderer.addClass(body, 'light-theme');
      this.renderer.removeClass(body, 'dark-theme');
    }
  }
}
