import { createReducer, on } from '@ngrx/store';
import { AuthSession } from '../../../core/models/auth.models';
import { AuthActions } from './auth.actions';

export interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  session: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.initFromStorage, (s) => ({ ...s, loading: true, error: null })),
  on(AuthActions.initFromStorageSuccess, (s, { session }) => ({ ...s, session, loading: false })),
  on(AuthActions.initFromStorageEmpty, (s) => ({ ...s, session: null, loading: false })),
  on(AuthActions.login, (s) => ({ ...s, loading: true, error: null })),
  on(AuthActions.loginSuccess, (s, { session }) => ({ ...s, session, loading: false })),
  on(AuthActions.loginFailure, (s, { message }) => ({ ...s, error: message, loading: false })),
  on(AuthActions.logout, () => initialAuthState)
);

