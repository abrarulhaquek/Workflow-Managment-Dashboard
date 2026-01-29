import { Routes } from '@angular/router';

export const WORKFLOWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/workflow-list-page/workflow-list-page.component').then(
        (m) => m.WorkflowListPageComponent
      )
  }
];

