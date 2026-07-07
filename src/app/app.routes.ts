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
    path: 'ranks',
    loadComponent: () => import('./features/ranks/ranks.component').then(m => m.RanksComponent)
  },
  {
    path: 'india-china',
    loadComponent: () => import('./features/india-china/india-china.component').then(m => m.IndiaChinaComponent)
  },
  {
    path: 'unit-categories',
    loadComponent: () => import('./features/unit-categories/unit-categories.component').then(m => m.UnitCategoriesComponent)
  },
  {
    path: 'advanced-technology',
    loadComponent: () => import('./features/advanced-technology/advanced-technology.component').then(m => m.AdvancedTechnologyComponent)
  },
  {
    path: 'aviation-detailed',
    loadComponent: () => import('./features/aviation-detailed/aviation-detailed.component').then(m => m.AviationDetailedComponent)
  },
  {
    path: 'air-defence-detailed',
    loadComponent: () => import('./features/air-defence-detailed/air-defence-detailed.component').then(m => m.AirDefenceDetailedComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
