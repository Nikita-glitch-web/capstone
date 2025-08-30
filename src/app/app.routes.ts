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
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./features/items/pages/list.page').then(m => m.ListPage),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./features/items/pages/edit.page').then(m => m.EditPage),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/items/pages/edit.page').then(m => m.EditPage),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/items/components/details/details.component')
            .then(m => m.DetailsComponent),
      },
    ],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
