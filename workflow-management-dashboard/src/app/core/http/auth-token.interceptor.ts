import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenStorage } from '../storage/auth-token.storage';
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthTokenStorage).getToken();
  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};

