import { createFeatureSelector, createSelector } from '@ngrx/store';

import { workflowsAdapter, WorkflowsState } from './workflows.reducer';

export const selectWorkflowsState = createFeatureSelector<WorkflowsState>('workflows');

const { selectAll, selectEntities } = workflowsAdapter.getSelectors(selectWorkflowsState);

export const selectAllWorkflows = selectAll;
export const selectWorkflowEntities = selectEntities;
export const selectWorkflowsLoading = createSelector(selectWorkflowsState, (s) => s.loading);
export const selectWorkflowsError = createSelector(selectWorkflowsState, (s) => s.error);
export const selectWorkflowsTotal = createSelector(selectWorkflowsState, (s) => s.total);
export const selectWorkflowsQuery = createSelector(selectWorkflowsState, (s) => s.query);

