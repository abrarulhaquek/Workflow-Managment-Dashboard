import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Workflow, WorkflowListQuery } from '../../core/models/workflow.models';
import {
  selectAllWorkflows,
  selectWorkflowEntities,
  selectWorkflowsError,
  selectWorkflowsLoading,
  selectWorkflowsQuery,
  selectWorkflowsTotal
} from './store/workflows.selectors';
import { WorkflowsActions } from './store/workflows.actions';

@Injectable({ providedIn: 'root' })
export class WorkflowsFacade {
  private readonly store = inject(Store);

  readonly workflows$: Observable<Workflow[]> = this.store.select(selectAllWorkflows);
  readonly entities$ = this.store.select(selectWorkflowEntities);
  readonly loading$ = this.store.select(selectWorkflowsLoading);
  readonly error$ = this.store.select(selectWorkflowsError);
  readonly total$ = this.store.select(selectWorkflowsTotal);
  readonly query$ = this.store.select(selectWorkflowsQuery);

  load(query: WorkflowListQuery): void {
    this.store.dispatch(WorkflowsActions.load({ query }));
  }

  setQuery(query: WorkflowListQuery): void {
    this.store.dispatch(WorkflowsActions.setQuery({ query }));
  }

  create(workflow: Omit<Workflow, 'id' | 'createdAt'>): void {
    this.store.dispatch(WorkflowsActions.create({ workflow }));
  }

  updateOptimistic(id: string, patch: Partial<Workflow>, previous: Workflow): void {
    this.store.dispatch(WorkflowsActions.updateOptimistic({ id, patch, previous }));
  }

  deleteOptimistic(id: string, previous: Workflow): void {
    this.store.dispatch(WorkflowsActions.deleteOptimistic({ id, previous }));
  }
}

