export type WorkflowStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected';
export type WorkflowPriority = 'Low' | 'Medium' | 'High';

export interface Workflow {
  id: string;
  name: string;
  priority: WorkflowPriority;
  status: WorkflowStatus;
  assignedUserIds: string[];
  dueDate: string; // ISO date (yyyy-mm-dd)
  createdAt: string; // ISO datetime
  completedAt?: string; // ISO datetime
}

export interface WorkflowListQuery {
  page: number;
  pageSize: number;
  search?: string;
  status?: WorkflowStatus;
  assignedUserId?: string;
  fromDate?: string; // ISO date
  toDate?: string; // ISO date
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

