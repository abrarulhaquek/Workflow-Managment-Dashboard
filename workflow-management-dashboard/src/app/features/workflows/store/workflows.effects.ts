import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import { WorkflowsApi } from '../services/workflows.api';
import { WorkflowsActions } from './workflows.actions';
import { selectWorkflowEntities, selectWorkflowsQuery } from './workflows.selectors';

@Injectable()
export class WorkflowsEffects {
  readonly load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowsActions.load),
      switchMap(({ query }) =>
        this.api.list(query).pipe(
          map((result) => WorkflowsActions.loadSuccess({ result, query })),
          catchError((e) =>
            of(WorkflowsActions.loadFailure({ message: e?.error?.message ?? 'Failed to load workflows.' }))
          )
        )
      )
    )
  );

  readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowsActions.create),
      switchMap(({ workflow }) =>
        this.api.create(workflow).pipe(
          map((created) => WorkflowsActions.createSuccess({ workflow: created })),
          // refresh list to keep server-side paging accurate
          withLatestFrom(this.store.select(selectWorkflowsQuery)),
          switchMap(([action, query]) => of(action, WorkflowsActions.load({ query }))),
          catchError((e) =>
            of(WorkflowsActions.createFailure({ message: e?.error?.message ?? 'Failed to create workflow.' }))
          )
        )
      )
    )
  );

  readonly updateOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowsActions.updateOptimistic),
      switchMap(({ id, patch, previous }) =>
        this.api.update(id, patch).pipe(
          map((workflow) => WorkflowsActions.updateConfirmed({ workflow })),
          catchError((e) =>
            of(
              WorkflowsActions.updateReverted({
                previous,
                message: e?.error?.message ?? 'Failed to update workflow.'
              })
            )
          )
        )
      )
    )
  );

  readonly deleteOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowsActions.deleteOptimistic),
      switchMap(({ id, previous }) =>
        this.api.delete(id).pipe(
          map(() => WorkflowsActions.deleteConfirmed({ id })),
          withLatestFrom(this.store.select(selectWorkflowsQuery)),
          switchMap(([action, query]) => of(action, WorkflowsActions.load({ query }))),
          catchError((e) =>
            of(
              WorkflowsActions.deleteReverted({
                previous,
                message: e?.error?.message ?? 'Failed to delete workflow.'
              })
            )
          )
        )
      )
    )
  );

  // Helper: when user triggers "Update" from UI, we can enrich it with `previous`
  readonly enrichUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowsActions.updateConfirmed),
      map(() => ({ type: '[Workflows] Noop' }))
    ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly api: WorkflowsApi,
    private readonly store: Store
  ) {}
}

