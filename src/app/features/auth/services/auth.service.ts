// src/app/features/auth/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

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

  // Для інтерцептора та UI
  getToken(): string | null {
    return this._token();
  }

  token = this._token;

  login(username: string, password: string): Observable<AuthResponse> {
    // Використовуємо demo credentials, якщо порожні
    const body = {
      username: username || 'kminchelle',
      password: password || '0lelplR'
    };

    return this.http
      .post<AuthResponse>('https://dummyjson.com/auth/login', body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((res) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            this._token.set(res.token);
          }
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      this._token.set(null);
    }
  }
}
