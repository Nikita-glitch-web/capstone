// src/app/core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(null);
  isLoggedIn = computed(() => !!this._token());

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      this._token.set(token);
    }
  }

  getToken(): string | null {
    return this._token();
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>('https://dummyjson.com/auth/login', { username, password })
      .pipe(
        tap(res => {
          this._token.set(res.token);
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  logout(): void {
    this._token.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }

  get token(): string | null {
    return this._token();
  }
}
