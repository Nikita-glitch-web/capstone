import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const token = auth.token; // гетер token

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
