import { type PriorityLabel } from '../variables/priority';
import { type StatusLabel } from '../variables/status';
import { type TaskPriority as TaskPriorityType } from '../variables/priority.enum';
import { type TaskStatus } from '../variables/status.enum';

export type TaskCardData = Pick<
  Task,
  'id' | 'boardId' | 'tags' | 'priority' | 'assignees' | 'dueDate' | 'isOverdue'
> & {
  checklist: {
    total: number;
    completed: number;
  } | null;
  attachment: number; // кастомное поле
};

export type SafeProfile = {
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export interface ChecklistItemInput {
  text: string;
  isCompleted: boolean;
  completedAt?: Date | null;
  position: number;
}

// Интерфейсы для вложенных документов
export interface ChecklistItem {
  _id: string;
  text: string;
  isCompleted: boolean;
  completedAt?: Date | null;
  position: number;
}

export interface TaskAttachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number; // в байтах
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskComment {
  _id: string;
  userId: string;
  text: string;
  createdAt: Date;
  editedAt: Date | null;
}

export interface TaskHistoryEntry {
  action: 'created' | 'moved' | 'assigned' | 'updated' | 'completed' | 'archived';
  userId: string;
  timestamp: Date;
  changes?: {
    field?: string;
    from?: any;
    to?: any;
    columnId?: string;
    position?: number;
  };
}

export interface TaskEstimate {
  value: number;
  unit: 'hours' | 'days' | 'points';
}

export interface TaskTimeTracking {
  startedAt: Date | null;
  totalTimeSpent: number; // в минутах
  sessions: Array<{
    startedAt: Date;
    endedAt: Date | null;
    duration: number; // в минутах
  }>;
}

export interface Tag {
  title: string;
  color: string;
}

// Основной интерфейс Task
export interface Task {
  id: string;
  boardId: string;
  columnId: string;

  title: string;
  description?: string;

  position: number;

  assignees: string[];
  creator: string;

  priority: TaskPriorityType;
  status: TaskStatus;

  estimate?: TaskEstimate;
  timeTracking?: TaskTimeTracking;

  tags: Tag[];

  dueDate?: Date;
  startDate?: Date;

  checklist: ChecklistItem[]; // массив объектов подзадач
  attachments: TaskAttachment[];
  comments: TaskComment[];
  history: TaskHistoryEntry[]; // массив изменений

  // Kanban специфичные поля
  blockedReason?: string; // если status = 'blocked'
  cycleTime?: number; // время от начала до завершения (в часах)
  leadTime?: number; // время от создания до завершения (в часах)

  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  archivedAt: Date | null;

  // Виртуальные поля
  isOverdue: boolean;
  isCompleted: boolean;
  checklistProgress: number;
  totalTimeSpent: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priorityLabel: PriorityLabel;
  statusLabel: StatusLabel;
  assignees: string[];
  tags: Tag[];
  checklist: ChecklistItemInput[];
  startDate?: Date;
  dueDate?: Date;
  estimate?: TaskEstimate;
}

export interface TaskPayloadBase {
  title: string;
  description?: string;
  priority: TaskPriorityType;
  status: TaskStatus;
  tags: Tag[];
  assignees: string[];
  checklist: ChecklistItemInput[];
  startDate?: Date;
  dueDate?: Date;
  estimate?: TaskEstimate;
}

export interface CreateTaskPayload extends TaskPayloadBase {
  creator: string;
  columnId: string;
}

export interface UpdateTaskPayload extends TaskPayloadBase {
  taskId: string;
}
