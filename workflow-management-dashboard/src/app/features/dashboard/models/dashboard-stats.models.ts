export interface DashboardStats {
    byStatus: {
        Draft: number;
        'In Review': number;
        Approved: number;
        Rejected: number;
    };
    overdue: number;
    averageCompletionDays: number | null;
}
