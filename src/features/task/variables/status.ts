import { TaskStatusEnum, type TaskStatus } from './status.enum';

export const statusLabels = ['Активная', 'Заблокирована', 'Архивная'] as const;
export type StatusLabel = (typeof statusLabels)[number];

export const STATUS_LABEL_MAP: Record<StatusLabel, TaskStatus> = {
  Активная: TaskStatusEnum.ACTIVE,
  Заблокирована: TaskStatusEnum.BLOCKED,
  Архивная: TaskStatusEnum.ARCHIVED,
};

export const STATUS_REVERSE_MAP: Record<TaskStatus, StatusLabel> = {
  [TaskStatusEnum.ACTIVE]: 'Активная',
  [TaskStatusEnum.BLOCKED]: 'Заблокирована',
  [TaskStatusEnum.ARCHIVED]: 'Архивная',
};
