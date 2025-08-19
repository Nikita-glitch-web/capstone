import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  private checkLogin(): boolean {
    if (this.auth.isLoggedIn()) { // викликаємо signal як функцію
      return true;
    }
    this.router.navigate(['/auth']); // редірект на login сторінку
    return false;
  }

  canActivate(): boolean {
    return this.checkLogin();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.checkLogin();
  }
}
