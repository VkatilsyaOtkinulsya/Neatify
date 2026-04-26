import type { HabitIconKey } from '@/shared/config/habitIcons';

export interface CreateHabitDto {
  name: string;
  icon: HabitIconKey;
  order?: number;
}

/** Что приходит с клиента при обновлении */
export interface UpdateHabitDto {
  name?: string;
  icon?: HabitIconKey;
  order?: number;
}

/** Что отдаём клиенту */
export interface HabitResponse {
  id: string;
  userId: string;
  name: string;
  icon: HabitIconKey;
  order: number;
  createdAt: string;
}

export interface ToggleHabitDto {
  date: string; // "YYYY-MM-DD"
  habitId: string;
  done: boolean;
}

/** Инициализировать лог на день (создаётся автоматически) */
export interface CreateHabitLogDto {
  date: string; // "YYYY-MM-DD"
  habitIds: string[];
}

export interface HabitEntryResponse {
  habitId: string;
  done: boolean;
}

export interface HabitLogResponse {
  id: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
  habits: HabitEntryResponse[];
  progress: number;
}

export interface HabitLogRangeResponse {
  habits: HabitResponse[];
  logs: HabitLogResponse[];
}
