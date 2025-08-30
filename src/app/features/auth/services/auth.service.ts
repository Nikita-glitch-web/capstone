// src/app/features/auth/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  token(token: any): unknown;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessToken = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);

  isLoggedIn = computed(() => !!this._accessToken());
  accessToken = this._accessToken;
  refreshToken = this._refreshToken;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedAccess = localStorage.getItem('accessToken');
      const storedRefresh = localStorage.getItem('refreshToken');
      this._accessToken.set(storedAccess);
      this._refreshToken.set(storedRefresh);
    }
  }

  getToken(): string | null {
    return this._accessToken();
  }

 login(username: string, password: string): Observable<AuthResponse> {
  const body = {
    username: (username || 'emilys').trim(),
    password: (password || 'emilyspass').trim(),
    expiresInMins: 60,
  };

  return this.http
    .post<AuthResponse>('https://dummyjson.com/auth/login', body, {
      headers: { 'Content-Type': 'application/json' },
    })
    .pipe(
      tap((res) => {
        if (res?.accessToken) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
          }
          this._accessToken.set(res.accessToken);
          this._refreshToken.set(res.refreshToken);
        }
      })
    );
}


  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    this._accessToken.set(null);
    this._refreshToken.set(null);
  }
}
