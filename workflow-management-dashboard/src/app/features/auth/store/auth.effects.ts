import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthTokenStorage } from '../../../core/storage/auth-token.storage';
import { AuthSession } from '../../../core/models/auth.models';
import { AuthApi } from '../services/auth.api';
import { AuthActions } from './auth.actions';

function decodeSessionFromToken(token: string): AuthSession | null {
  try {
    const decoded = JSON.parse(atob(token)) as {
      username?: string;
      role?: any;
      userId?: string;
    };

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
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AuthApi);
  private readonly tokenStorage = inject(AuthTokenStorage);
  private readonly router = inject(Router);

  readonly initFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initFromStorage),
      map(() => this.tokenStorage.getToken()),
      map((token) => {
        if (!token) return AuthActions.initFromStorageEmpty();
        const session = decodeSessionFromToken(token);
        return session
          ? AuthActions.initFromStorageSuccess({ session })
          : AuthActions.initFromStorageEmpty();
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
            of(
              AuthActions.loginFailure({
                message: e?.error?.message ?? 'Login failed.'
              })
            )
          )
        )
      )
    )
  );

  readonly persistToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.loginSuccess,
          AuthActions.initFromStorageSuccess
        ),
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

  readonly loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );
}
