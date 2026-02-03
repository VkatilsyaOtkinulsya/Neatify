export const TaskPriorityEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type TaskPriority = (typeof TaskPriorityEnum)[keyof typeof TaskPriorityEnum];

export const TaskStatusEnum = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  ARCHIVED: 'archived',
} as const;

export type TaskStatus = (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum];

// Интерфейсы для вложенных документов
export interface ChecklistItem {
  _id: string;
  text: string;
  isCompleted: boolean;
  completedAt: Date | null;
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

  assignees: string[]; // массив userId
  creator: string;

  priority: TaskPriority;
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
