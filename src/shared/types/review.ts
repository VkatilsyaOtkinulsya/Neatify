export interface ReviewPeriod {
  from?: Date;
  to?: Date;
}

export interface OverviewStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  blocked: number;
  unassigned: number;
  completionRate: number;
}

export interface AssigneeStats {
  userId: string;
  total: number;
  completed: number;
  overdue: number;
  avgCycleTime: number | null;
}

export interface TimingStats {
  avgLeadTime: number | null;
  avgCycleTime: number | null;
  onTimeRate: number;
}

export interface RiskStats {
  highPriorityOverdue: number;
  dueSoon: number;
  noDueDate: number;
  noAssignee: number;
}

export interface ActivityPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ActivityStats {
  createdByDay: ActivityPoint[];
  completedByDay: ActivityPoint[];
  totalTimeSpent: number;
}

export interface ReviewSnapshot {
  generatedAt: Date;
  period: { from: Date | null; to: Date | null };
  overview: OverviewStats;
  byAssignee: AssigneeStats[];
  timing: TimingStats;
  risks: RiskStats;
  activity: ActivityStats;
}
