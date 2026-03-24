export const TaskStatusEnum = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  ARCHIVED: 'archived',
} as const;

export type TaskStatus = (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum];
