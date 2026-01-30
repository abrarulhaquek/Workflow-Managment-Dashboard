import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession, Role } from '../../../core/models/auth.models';
@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private readonly http: HttpClient) { }

  login(username: string, role: Role): Observable<AuthSession> {
    return this.http.post<AuthSession>('/api/auth/login', { username, role });
  }
}

