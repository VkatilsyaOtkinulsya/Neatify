import { TaskPriority } from './priority.enum';

export const priorityLabels = ['Низкий', 'Средний', 'Критичный', 'Блокер'] as const;
export type PriorityLabel = (typeof priorityLabels)[number];

export const PRIORITY_LABEL_MAP: Record<PriorityLabel, TaskPriority> = {
  Низкий: TaskPriority.LOW,
  Средний: TaskPriority.MEDIUM,
  Критичный: TaskPriority.HIGH,
  Блокер: TaskPriority.URGENT,
};

export const PRIORITY_REVERSE_MAP: Record<TaskPriority, PriorityLabel> = {
  [TaskPriority.LOW]: 'Низкий',
  [TaskPriority.MEDIUM]: 'Средний',
  [TaskPriority.HIGH]: 'Критичный',
  [TaskPriority.URGENT]: 'Блокер',
};
