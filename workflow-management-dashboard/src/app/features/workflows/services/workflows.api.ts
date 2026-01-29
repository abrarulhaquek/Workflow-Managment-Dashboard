import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult, Workflow, WorkflowListQuery } from '../../../core/models/workflow.models';

@Injectable({ providedIn: 'root' })
export class WorkflowsApi {
  constructor(private readonly http: HttpClient) {}

  list(query: WorkflowListQuery): Observable<PagedResult<Workflow>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);
    if (query.assignedUserId) params = params.set('assignedUserId', query.assignedUserId);
    if (query.fromDate) params = params.set('fromDate', query.fromDate);
    if (query.toDate) params = params.set('toDate', query.toDate);

    return this.http.get<PagedResult<Workflow>>('/api/workflows', { params });
  }

  create(workflow: Omit<Workflow, 'id' | 'createdAt'>): Observable<Workflow> {
    return this.http.post<Workflow>('/api/workflows', workflow);
  }

  update(id: string, patch: Partial<Workflow>): Observable<Workflow> {
    return this.http.put<Workflow>(`/api/workflows/${encodeURIComponent(id)}`, patch);
  }

  delete(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`/api/workflows/${encodeURIComponent(id)}`);
  }

  validateName(name: string, excludeId?: string): Observable<{ isUnique: boolean }> {
    let params = new HttpParams().set('name', name);
    if (excludeId) params = params.set('excludeId', excludeId);
    return this.http.get<{ isUnique: boolean }>('/api/workflows/validate-name', { params });
  }
}

