// src/app/features/auth/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(null);
  isLoggedIn = computed(() => !!this._token());

  constructor() {
    // Перевіряємо, чи ми в браузері
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      this._token.set(token);
    }
  }

  login(email: string, password: string) {
    // Псевдо-логіка login, можна замінити на HTTP
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', 'fake-jwt-token');
      this._token.set('fake-jwt-token');
    }

    // Повертаємо observable для підписки у компоненті
    return {
      subscribe: ({ next }: { next: () => void }) => next()
    };
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      this._token.set(null);
    }
  }
}
