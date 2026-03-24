import type { Task, TaskPayloadBase } from '../types/task.types';

export const mergeTask = (task: Task, data: TaskPayloadBase): Task => ({
  ...task,

  title: data.title,
  description: data.description,
  priority: data.priority,
  status: data.status,
  tags: data.tags,
  assignees: data.assignees,
  startDate: data.startDate,
  dueDate: data.dueDate,

  // ❗ оставляем старый checklist
  checklist: task.checklist,
});
