import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./features/items/items.page').then(m => m.ItemsPage),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.page').then(m => m.SettingsPage),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
];
