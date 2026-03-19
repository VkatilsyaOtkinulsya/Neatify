import { createApiService } from '../client/api.factory';
import axiosApiInstance from '../api';
import type { Task, TaskPayloadBase } from '@/features/task/types/task.types';
import type { BoardTasksResponse } from '../types/api.types';
import type { CreateTaskPayload } from '../queries/useTasks';
import { buildUrl } from '@/shared/lib/utils/buildUrl';

const BASE_URL = import.meta.env.VITE_API_TASKS_URL as string;

export const baseService = createApiService<Task, TaskPayloadBase, Partial<TaskPayloadBase>>(
  BASE_URL
);

export const TaskService = {
  ...baseService,

  async getBoardTasks(boardId: string): Promise<BoardTasksResponse> {
    const url = buildUrl(BASE_URL, 'boards/:boardId/tasks', { boardId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async createInBoard(boardId: string, data: CreateTaskPayload): Promise<Task> {
    const url = buildUrl(BASE_URL, 'boards/:boardId/tasks', { boardId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async delete(taskId: string, permanent?: boolean) {
    const url = buildUrl(BASE_URL, `:taskId${permanent ? '?permanent=true' : ''}`, { taskId });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },

  async complete(taskId: string): Promise<Task> {
    const url = buildUrl(BASE_URL, ':taskId/complete', { taskId });
    const response = await axiosApiInstance.patch(url);
    return response.data;
  },

  async moveTask({
    taskId,
    fromColumnId,
    toColumnId,
    beforeTaskId,
    afterTaskId,
  }: {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    beforeTaskId?: string;
    afterTaskId?: string;
  }): Promise<Task> {
    const query = new URLSearchParams();

    if (beforeTaskId) {
      query.set('beforeTaskId', beforeTaskId);
    }

    if (afterTaskId) {
      query.set('afterTaskId', afterTaskId);
    }

    const url =
      buildUrl(BASE_URL, ':taskId/move', { taskId }) +
      (query.toString() ? `?${query.toString()}` : '');

    const response = await axiosApiInstance.patch(url, {
      taskId,
      fromColumnId,
      toColumnId,
    });

    return response.data;
  },
};
