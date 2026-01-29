import { APP_INITIALIZER } from '@angular/core';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { authTokenInterceptor } from './core/http/auth-token.interceptor';
import { errorHandlingInterceptor } from './core/http/error-handling.interceptor';
import { mockApiInterceptor } from './core/http/mock-api.interceptor';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { workflowsReducer } from './features/workflows/store/workflows.reducer';
import { WorkflowsEffects } from './features/workflows/store/workflows.effects';
import { AuthActions } from './features/auth/store/auth.actions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      mockApiInterceptor,
      authTokenInterceptor,
      errorHandlingInterceptor
    ])),
    provideCharts(withDefaultRegisterables()),

    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [Store],
      useFactory: (store: Store) => () =>
        store.dispatch(AuthActions.initFromStorage())
    },

    provideStore({
      auth: authReducer,
      workflows: workflowsReducer
    }),
    provideEffects([AuthEffects, WorkflowsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
};
