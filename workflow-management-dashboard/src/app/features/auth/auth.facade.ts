import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthSession, AuthUser, Role } from '../../core/models/auth.models';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthRole,
  selectAuthSession,
  selectAuthUser,
  selectIsAuthenticated
} from './store/auth.selectors';
import { AuthActions } from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly session$: Observable<AuthSession | null> = this.store.select(selectAuthSession);
  readonly user$: Observable<AuthUser | null> = this.store.select(selectAuthUser);
  readonly role$: Observable<Role | null> = this.store.select(selectAuthRole);
  readonly isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  readonly loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  readonly error$: Observable<string | null> = this.store.select(selectAuthError);

  constructor() { }

  initFromStorage(): void {
    this.store.dispatch(AuthActions.initFromStorage());
  }

  login(username: string, role: Role): void {
    this.store.dispatch(AuthActions.login({ username, role }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}

