import { createSelector } from '@ngrx/store';
import { selectAllWorkflows } from '../workflows/store/workflows.selectors';

function daysBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return (end - start) / 86400000;
}

export const selectWorkflowsByStatus = createSelector(selectAllWorkflows, (workflows) => {
  const counts: Record<string, number> = { Draft: 0, 'In Review': 0, Approved: 0, Rejected: 0 };
  for (const w of workflows) counts[w.status] = (counts[w.status] ?? 0) + 1;
  return counts as Record<'Draft' | 'In Review' | 'Approved' | 'Rejected', number>;
});

export const selectOverdueCount = createSelector(selectAllWorkflows, (workflows) => {
  const today = new Date().toISOString().slice(0, 10);
  return workflows.filter((w) => w.dueDate < today && w.status !== 'Approved').length;
});

export const selectAverageCompletionDays = createSelector(selectAllWorkflows, (workflows) => {
  const completed = workflows.filter((w) => w.completedAt);
  if (!completed.length) return null;
  const totalDays = completed.reduce((sum, w) => sum + daysBetween(w.createdAt, w.completedAt!), 0);
  return totalDays / completed.length;
});

