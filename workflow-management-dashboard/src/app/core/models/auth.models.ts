export type Role = 'admin' | 'manager' | 'user';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

