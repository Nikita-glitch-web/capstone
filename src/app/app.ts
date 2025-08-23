import { Component, signal, Renderer2, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from "@angular/material/toolbar";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatSlideToggleModule, MatSidenavModule, MatIconModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected readonly title = signal('capstone');

  isDarkTheme = false;
  isSidenavOpened = true;
  private renderer = inject(Renderer2);
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.updateBodyClass();

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSidenavOpened = !result.matches;
      });
  }

  toggleTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.updateBodyClass();
  }

  private updateBodyClass() {
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
