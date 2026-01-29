import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AuthSession, Role } from '../../../core/models/auth.models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init From Storage': emptyProps(),
    'Init From Storage Success': props<{ session: AuthSession }>(),
    'Init From Storage Empty': emptyProps(),

    Login: props<{ username: string; role: Role }>(),
    'Login Success': props<{ session: AuthSession }>(),
    'Login Failure': props<{ message: string }>(),

    Logout: emptyProps()
  }
});

