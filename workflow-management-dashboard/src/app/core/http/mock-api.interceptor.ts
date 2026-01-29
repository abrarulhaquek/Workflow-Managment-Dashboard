import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { MockDbService } from '../mock/mock-db.service';
import { WorkflowListQuery } from '../models/workflow.models';

const apiPrefix = '/api';

function json<T>(body: T, status = 200): HttpResponse<T> {
  return new HttpResponse({ status, body });
}

function badRequest(message: string): HttpErrorResponse {
  return new HttpErrorResponse({ status: 400, error: { message } });
}

function unauthorized(message = 'Unauthorized'): HttpErrorResponse {
  return new HttpErrorResponse({ status: 401, error: { message } });
}

function parseUrl(req: HttpRequest<unknown>): URL {
  // Need an absolute base for URL parsing in browser.
  return new URL(req.url, window.location.origin);
}

function parseIntParam(v: string | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getBearer(req: HttpRequest<unknown>): string | null {
  const auth = req.headers.get('Authorization');
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/);
  return m?.[1] ?? null;
}

function requireAuth(req: HttpRequest<unknown>): void {
  const token = getBearer(req);
  if (!token) throw unauthorized();
}

function handle(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (!req.url.startsWith(apiPrefix)) return next(req);

  const db = inject(MockDbService);
  const url = parseUrl(req);
  const { pathname, searchParams } = url;

  return of(null).pipe(
    delay(250),
    mergeMap(() => {
      try {
        // AUTH
        if (pathname === `${apiPrefix}/auth/login` && req.method === 'POST') {
          const { username, role } = (req.body ?? {}) as { username?: string; role?: string };
          if (!username || !role) return throwError(() => badRequest('Username and role are required.'));
          return of(json(db.login(username, role as any), 200));
        }

        // Everything below requires auth
        requireAuth(req);

        // WORKFLOWS: validate name
        if (pathname === `${apiPrefix}/workflows/validate-name` && req.method === 'GET') {
          const name = searchParams.get('name') ?? '';
          const excludeId = searchParams.get('excludeId') ?? undefined;
          if (!name.trim()) return of(json({ isUnique: true }, 200));
          return of(json({ isUnique: db.isWorkflowNameUnique(name, excludeId) }, 200));
        }

        // WORKFLOWS: list
        if (pathname === `${apiPrefix}/workflows` && req.method === 'GET') {
          const query: WorkflowListQuery = {
            page: parseIntParam(searchParams.get('page'), 1),
            pageSize: parseIntParam(searchParams.get('pageSize'), 10),
            search: searchParams.get('search') ?? undefined,
            status: (searchParams.get('status') as any) ?? undefined,
            assignedUserId: searchParams.get('assignedUserId') ?? undefined,
            fromDate: searchParams.get('fromDate') ?? undefined,
            toDate: searchParams.get('toDate') ?? undefined
          };
          return of(json(db.listWorkflows(query), 200));
        }

        // WORKFLOWS: create
        if (pathname === `${apiPrefix}/workflows` && req.method === 'POST') {
          const created = db.createWorkflow(req.body as any);
          return of(json(created, 201));
        }

        // WORKFLOWS: update/delete by id
        const wfMatch = pathname.match(new RegExp(`^${apiPrefix}/workflows/([^/]+)$`));
        if (wfMatch) {
          const id = decodeURIComponent(wfMatch[1]);

          if (req.method === 'PUT' || req.method === 'PATCH') {
            const updated = db.updateWorkflow(id, req.body as any);
            return of(json(updated, 200));
          }

          if (req.method === 'DELETE') {
            db.deleteWorkflow(id);
            return of(json({ ok: true }, 200));
          }
        }

        return throwError(
          () => new HttpErrorResponse({ status: 404, error: { message: 'Not found' } })
        );
      } catch (e: any) {
        const message = typeof e?.message === 'string' ? e.message : 'Request failed.';
        const status = e instanceof HttpErrorResponse ? e.status : 400;
        return throwError(() => new HttpErrorResponse({ status, error: { message } }));
      }
    })
  );
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => handle(req, next);

