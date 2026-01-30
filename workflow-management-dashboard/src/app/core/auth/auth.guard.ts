import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthTokenStorage } from '../storage/auth-token.storage';
export const authGuard: CanActivateFn = () => {
  const storage = inject(AuthTokenStorage);
  const router = inject(Router);

  const token = storage.getToken();
  return token ? true : router.parseUrl('/auth/login');
};

