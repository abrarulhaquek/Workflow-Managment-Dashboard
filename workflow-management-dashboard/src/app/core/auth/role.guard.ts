import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { Role } from '../models/auth.models';
import { selectAuthRole, selectIsAuthenticated } from '../../features/auth/store/auth.selectors';

export function roleGuard(allowed: Role[]): CanMatchFn {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return combineLatest([
      store.select(selectIsAuthenticated),
      store.select(selectAuthRole)
    ]).pipe(
      map(([isAuthed, role]) => {
        if (!isAuthed) return router.parseUrl('/auth/login');
        if (!role) return router.parseUrl('/auth/login');
        return allowed.includes(role) ? true : router.parseUrl('/dashboard');
      })
    );
  };
}

