import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'data',
    loadComponent: () => import('./features/excel-data-viewer/excel-data-viewer.component').then(m => m.ExcelDataViewerComponent)
  },
  {
    path: 'hierarchy',
    loadComponent: () => import('./features/hierarchy/hierarchy.component').then(m => m.HierarchyComponent)
  },
  {
    path: 'land',
    loadComponent: () => import('./features/land/land.component').then(m => m.LandComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
