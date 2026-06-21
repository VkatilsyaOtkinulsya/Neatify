export interface Objective {
  _id: string;
  workspaceId: string;
  title: string;
  description?: string;
  period: {
    start: string; // ISO date
    end: string; // ISO date
  };
  status: 'active' | 'completed' | 'archived';
  key_results: KeyResult[];
  progress: number; // [0, 1]
  createdAt: string;
  updatedAt: string;
}

export interface KeyResult {
  _id: string;
  title: string;
  status: 'not_started' | 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'cancelled';
  projects: Array<{ id: string; title: string }>;
  metric?: KRMetric;
  metric_progress: number; // [0, 1]
  project_progress: number; // [0, 1]
  weight: number; // [0, 1]
  owner_id: string;
}

export type KRMetric = NumberMetric | BooleanMetric;

export interface NumberMetric {
  type: 'number';
  direction: 'increase' | 'decrease';
  unit?: string;
  start: number;
  current: number;
  target: number;
}

export interface BooleanMetric {
  type: 'boolean';
  current: boolean;
  target: true;
}

export interface CreateObjectiveDto {
  title: string;
  description?: string;
  period: {
    start: string;
    end: string;
  };
  status?: 'active' | 'completed' | 'archived';
}

export interface UpdateObjectiveDto {
  title?: string;
  description?: string;
  period?: {
    start: string;
    end: string;
  };
  status?: 'active' | 'completed' | 'archived';
}

export interface CreateKeyResultDto {
  title: string;
  owner_id: string;
  weight: number;
  metric?: KRMetric;
  projects?: Array<{ id: string; title: string }>;
}

export interface UpdateKeyResultDto {
  title?: string;
  weight?: number;
  owner_id?: string;
  status?: KeyResult['status'];
  projects?: Array<{ id: string; title: string }>;
}

export interface UpdateMetricDto {
  current: number | boolean;
}

export const KR_STATUS_LABELS: Record<KeyResult['status'], string> = {
  not_started: 'Не начат',
  on_track: 'В процессе',
  at_risk: 'Под угрозой',
  off_track: 'Отстаёт',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

export const KR_STATUS_COLORS: Record<KeyResult['status'], string> = {
  not_started: '#9e9e9e',
  on_track: '#4caf50',
  at_risk: '#ff9800',
  off_track: '#f44336',
  completed: '#2196f3',
  cancelled: '#757575',
};
