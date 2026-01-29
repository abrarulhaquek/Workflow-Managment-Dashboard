import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthTokenStorage } from '../storage/auth-token.storage';

// Simple, synchronous auth guard: if we have a token in storage,
// allow navigation; otherwise send the user to the login screen.
export const authGuard: CanActivateFn = () => {
  const storage = inject(AuthTokenStorage);
  const router = inject(Router);

  const token = storage.getToken();
  return token ? true : router.parseUrl('/auth/login');
};

