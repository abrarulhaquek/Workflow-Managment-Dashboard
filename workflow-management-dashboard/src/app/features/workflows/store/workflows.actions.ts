import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { PagedResult, Workflow, WorkflowListQuery } from '../../../core/models/workflow.models';

export const WorkflowsActions = createActionGroup({
  source: 'Workflows',
  events: {
    'Set Query': props<{ query: WorkflowListQuery }>(),
    Load: props<{ query: WorkflowListQuery }>(),
    'Load Success': props<{ result: PagedResult<Workflow>; query: WorkflowListQuery }>(),
    'Load Failure': props<{ message: string }>(),

    Create: props<{ workflow: Omit<Workflow, 'id' | 'createdAt'> }>(),
    'Create Success': props<{ workflow: Workflow }>(),
    'Create Failure': props<{ message: string }>(),

    'Update Optimistic': props<{ id: string; patch: Partial<Workflow>; previous: Workflow }>(),
    'Update Confirmed': props<{ workflow: Workflow }>(),
    'Update Reverted': props<{ previous: Workflow; message: string }>(),

    'Delete Optimistic': props<{ id: string; previous: Workflow }>(),
    'Delete Confirmed': props<{ id: string }>(),
    'Delete Reverted': props<{ previous: Workflow; message: string }>(),

    ClearError: emptyProps()
  }
});

