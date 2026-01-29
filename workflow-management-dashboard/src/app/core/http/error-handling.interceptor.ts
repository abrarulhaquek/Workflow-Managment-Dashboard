import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

function toFriendlyMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Network error. Please check your connection.';
    if (typeof error.error?.message === 'string') return error.error.message;
    if (typeof error.message === 'string' && error.message) return error.message;
    return `Request failed (${error.status}).`;
  }

  return 'Something went wrong.';
}

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err) => {
      snackBar.open(toFriendlyMessage(err), 'Dismiss', { duration: 4000 });
      return throwError(() => err);
    })
  );
};

