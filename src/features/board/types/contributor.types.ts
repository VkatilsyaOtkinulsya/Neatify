export interface EstimateBurned {
  points: number;
  hours: number;
  days: number;
}

export interface ContributorStats {
  userId: string;
  userName: string;
  completed: number;
  estimateBurned: EstimateBurned;
  avgCycleTime: number;
  onTimeRate: number;
  overdue: number;
  totalAssigned: number;
}

export interface ContributorsResponse {
  success: boolean;
  contributors: ContributorStats[];
}

export interface MyContributorResponse {
  success: boolean;
  contributor: ContributorStats;
}
