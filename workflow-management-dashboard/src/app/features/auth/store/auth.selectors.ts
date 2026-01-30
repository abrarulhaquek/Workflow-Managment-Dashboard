import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthSession = createSelector(selectAuthState, (s) => s.session);
export const selectAuthUser = createSelector(selectAuthSession, (s) => s?.user ?? null);
export const selectAuthRole = createSelector(selectAuthUser, (u) => u?.role ?? null);
export const selectIsAuthenticated = createSelector(selectAuthSession, (s) => !!s?.token);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.loading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);

