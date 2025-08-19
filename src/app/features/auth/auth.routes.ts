import { Routes } from '@angular/router';
import { AuthPage } from './auth.page';
import { LoginPage } from './pages/login.page';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPage },
    ],
  },
];
