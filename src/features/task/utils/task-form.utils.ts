import type { Task, TaskFormData, TaskPayloadBase } from '../types/task.types';
import { PRIORITY_LABEL_MAP, PRIORITY_REVERSE_MAP } from '../variables/priority';
import { STATUS_LABEL_MAP, STATUS_REVERSE_MAP } from '../variables/status';

export const formToPayload = (form: TaskFormData): TaskPayloadBase => ({
  title: form.title.trim(),
  description: form.description.trim() || undefined,
  priority: PRIORITY_LABEL_MAP[form.priorityLabel],
  status: STATUS_LABEL_MAP[form.statusLabel],
  tags: form.tags,
  assignees: form.assignees,
  checklist: form.checklist,
  startDate: form.startDate,
  dueDate: form.dueDate,
  estimate: form.estimate,
});

export const taskToForm = (task: Task): TaskFormData => ({
  title: task.title,
  description: task.description ?? '',
  priorityLabel: PRIORITY_REVERSE_MAP[task.priority] ?? 'Средний',
  statusLabel: STATUS_REVERSE_MAP[task.status] ?? 'Активная',
  assignees: task.assignees ?? [],
  tags: task.tags ?? [],
  checklist: task.checklist ?? [],
  startDate: task.startDate ? new Date(task.startDate) : undefined,
  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  estimate: task.estimate,
});
