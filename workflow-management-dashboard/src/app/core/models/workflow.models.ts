export type WorkflowStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected';
export type WorkflowPriority = 'Low' | 'Medium' | 'High';

export interface Workflow {
  id: string;
  name: string;
  priority: WorkflowPriority;
  status: WorkflowStatus;
  assignedUserIds: string[];
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface WorkflowListQuery {
  page: number;
  pageSize: number;
  search?: string;
  status?: WorkflowStatus;
  assignedUserId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

