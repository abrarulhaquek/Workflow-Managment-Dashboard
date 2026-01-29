import { Injectable } from '@angular/core';

import { SessionStorageService } from './session.storage';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorage {
  private readonly key = 'wmd_token';

  constructor(private readonly storage: SessionStorageService) {}

  getToken(): string | null {
    return this.storage.get(this.key);
  }

  setToken(token: string): void {
    this.storage.set(this.key, token);
  }

  clear(): void {
    this.storage.remove(this.key);
  }
}

