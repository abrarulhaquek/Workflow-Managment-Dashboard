import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { AuthTokenStorage } from '../../../core/storage/auth-token.storage';
import { AuthSession } from '../../../core/models/auth.models';
import { AuthApi } from '../services/auth.api';
import { AuthActions } from './auth.actions';
import { selectAuthSession } from './auth.selectors';

function decodeSessionFromToken(token: string): AuthSession | null {
  try {
    const decoded = JSON.parse(atob(token)) as { username?: string; role?: any; userId?: string };
    if (!decoded?.username || !decoded?.role || !decoded?.userId) return null;
    return {
      token,
      user: {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      }
    };
  } catch {
    return null;
  }
}

@Injectable()
export class AuthEffects {
  readonly initFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initFromStorage),
      map(() => this.tokenStorage.getToken()),
      map((token) => {
        if (!token) return AuthActions.initFromStorageEmpty();
        const session = decodeSessionFromToken(token);
        return session ? AuthActions.initFromStorageSuccess({ session }) : AuthActions.initFromStorageEmpty();
      })
    )
  );

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, role }) =>
        this.api.login(username, role).pipe(
          map((session) => AuthActions.loginSuccess({ session })),
          catchError((e) =>
            of(AuthActions.loginFailure({ message: e?.error?.message ?? 'Login failed.' }))
          )
        )
      )
    )
  );

  readonly persistToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.initFromStorageSuccess),
        tap(({ session }) => this.tokenStorage.setToken(session.token))
      ),
    { dispatch: false }
  );

  readonly clearToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.tokenStorage.clear())
      ),
    { dispatch: false }
  );


  constructor(
    private readonly actions$: Actions,
    private readonly api: AuthApi,
    private readonly tokenStorage: AuthTokenStorage,
    private readonly store: Store
  ) {}
}

