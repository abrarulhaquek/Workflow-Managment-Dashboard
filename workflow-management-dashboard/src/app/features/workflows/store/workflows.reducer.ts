import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Workflow, WorkflowListQuery } from '../../../core/models/workflow.models';
import { WorkflowsActions } from './workflows.actions';

export const workflowsAdapter = createEntityAdapter<Workflow>({
  selectId: (w) => w.id
});

export interface WorkflowsState extends EntityState<Workflow> {
  loading: boolean;
  error: string | null;
  total: number;
  query: WorkflowListQuery;
}

export const initialQuery: WorkflowListQuery = {
  page: 1,
  pageSize: 10
};

export const initialWorkflowsState: WorkflowsState = workflowsAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
  query: initialQuery
});

export const workflowsReducer = createReducer(
  initialWorkflowsState,

  on(WorkflowsActions.setQuery, (s, { query }) => ({ ...s, query })),
  on(WorkflowsActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(WorkflowsActions.loadSuccess, (s, { result, query }) =>
    workflowsAdapter.setAll(result.items, {
      ...s,
      loading: false,
      total: result.total,
      query
    })
  ),
  on(WorkflowsActions.loadFailure, (s, { message }) => ({ ...s, loading: false, error: message })),

  on(WorkflowsActions.create, (s) => ({ ...s, loading: true, error: null })),
  on(WorkflowsActions.createSuccess, (s, { workflow }) =>
    workflowsAdapter.upsertOne(workflow, { ...s, loading: false })
  ),
  on(WorkflowsActions.createFailure, (s, { message }) => ({ ...s, loading: false, error: message })),

  on(WorkflowsActions.updateOptimistic, (s, { id, patch }) =>
    workflowsAdapter.updateOne({ id, changes: patch }, s)
  ),
  on(WorkflowsActions.updateConfirmed, (s, { workflow }) =>
    workflowsAdapter.upsertOne(workflow, s)
  ),
  on(WorkflowsActions.updateReverted, (s, { previous, message }) =>
    workflowsAdapter.upsertOne(previous, { ...s, error: message })
  ),

  on(WorkflowsActions.deleteOptimistic, (s, { id }) => workflowsAdapter.removeOne(id, s)),
  on(WorkflowsActions.deleteConfirmed, (s) => s),
  on(WorkflowsActions.deleteReverted, (s, { previous, message }) =>
    workflowsAdapter.addOne(previous, { ...s, error: message })
  ),

  on(WorkflowsActions.clearError, (s) => ({ ...s, error: null }))
);

