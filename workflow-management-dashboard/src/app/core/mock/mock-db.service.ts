import { Injectable } from '@angular/core';

import { AuthSession, AuthUser, Role } from '../models/auth.models';
import { PagedResult, Workflow, WorkflowListQuery, WorkflowStatus } from '../models/workflow.models';

function isoNow(): string {
  return new Date().toISOString();
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function newId(): string {
  return crypto.randomUUID();
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

@Injectable({ providedIn: 'root' })
export class MockDbService {
  private readonly users: AuthUser[] = [
    { id: 'u_admin', username: 'admin', role: 'admin' },
    { id: 'u_manager', username: 'manager', role: 'manager' },
    { id: 'u_user', username: 'user', role: 'user' }
  ];

  private workflows: Workflow[] = this.seedWorkflows();

  login(username: string, role: Role): AuthSession {
    const existing = this.users.find((u) => normalize(u.username) === normalize(username) && u.role === role);
    const user: AuthUser = existing ?? { id: newId(), username, role };
    const token = btoa(JSON.stringify({ userId: user.id, role: user.role, username: user.username }));
    return { token, user };
  }

  listWorkflows(query: WorkflowListQuery): PagedResult<Workflow> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 10));

    let items = [...this.workflows];

    if (query.search) {
      const q = normalize(query.search);
      items = items.filter((w) => normalize(w.name).includes(q));
    }

    if (query.status) {
      items = items.filter((w) => w.status === query.status);
    }

    if (query.assignedUserId) {
      items = items.filter((w) => w.assignedUserIds.includes(query.assignedUserId!));
    }

    if (query.fromDate) {
      items = items.filter((w) => w.dueDate >= query.fromDate!);
    }
    if (query.toDate) {
      items = items.filter((w) => w.dueDate <= query.toDate!);
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    items = items.slice(start, start + pageSize);

    return { items, total };
  }

  isWorkflowNameUnique(name: string, excludeId?: string): boolean {
    const n = normalize(name);
    return !this.workflows.some((w) => normalize(w.name) === n && (!excludeId || w.id !== excludeId));
  }

  createWorkflow(input: Omit<Workflow, 'id' | 'createdAt'>): Workflow {
    if (!this.isWorkflowNameUnique(input.name)) {
      throw new Error('Workflow name must be unique.');
    }

    const workflow: Workflow = {
      ...input,
      id: newId(),
      createdAt: isoNow()
    };
    this.workflows = [workflow, ...this.workflows];
    return workflow;
  }

  updateWorkflow(id: string, patch: Partial<Workflow>): Workflow {
    const existing = this.workflows.find((w) => w.id === id);
    if (!existing) throw new Error('Workflow not found.');

    if (typeof patch.name === 'string' && !this.isWorkflowNameUnique(patch.name, id)) {
      throw new Error('Workflow name must be unique.');
    }

    const next: Workflow = { ...existing, ...patch };

    // auto-set completedAt when approved
    if (next.status === 'Approved' && !next.completedAt) {
      next.completedAt = isoNow();
    }
    if (next.status !== 'Approved') {
      next.completedAt = undefined;
    }

    this.workflows = this.workflows.map((w) => (w.id === id ? next : w));
    return next;
  }

  deleteWorkflow(id: string): void {
    const before = this.workflows.length;
    this.workflows = this.workflows.filter((w) => w.id !== id);
    if (this.workflows.length === before) throw new Error('Workflow not found.');
  }

  private seedWorkflows(): Workflow[] {
    const today = new Date();
    const mk = (name: string, status: WorkflowStatus, dueInDays: number): Workflow => ({
      id: newId(),
      name,
      priority: dueInDays <= 2 ? 'High' : 'Medium',
      status,
      assignedUserIds: ['u_user'],
      dueDate: isoDate(new Date(today.getTime() + dueInDays * 86400000)),
      createdAt: isoNow(),
      completedAt: status === 'Approved' ? isoNow() : undefined
    });

    return [
      mk('Vendor Onboarding', 'In Review', 3),
      mk('Purchase Approval', 'Approved', -1),
      mk('Security Review', 'Draft', 10),
      mk('Budget Reforecast', 'Rejected', 2)
    ];
  }
}

