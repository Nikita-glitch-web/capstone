import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./features/items/items.page').then(m => m.ItemsPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard],
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' },
];
