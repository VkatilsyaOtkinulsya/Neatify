import { buildUrl, createApiService } from '../client/api.factory';
import axiosApiInstance from '../api';
import type { Task } from '@/features/task/types/task.types';
import type { BoardTasksResponse } from '../types/api.types';

const BASE_URL = import.meta.env.VITE_API_TASKS_URL;

const baseService = createApiService<Task>(BASE_URL);

export const TaskService = {
  ...baseService,

  async getBoardTasks(boardId: string): Promise<BoardTasksResponse> {
    const url = buildUrl(BASE_URL, 'boards/:boardId/tasks', { boardId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async delete(taskId: string, permanent?: boolean) {
    const url = buildUrl(BASE_URL, `:taskId${permanent ? '?permanent=true' : ''}`, { taskId });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },

  async createInBoard(boardId: string, data: Partial<Task>): Promise<Task> {
    const url = buildUrl(BASE_URL, 'boards/:boardId/tasks', { boardId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async moveTask(taskId: string, columnId: string, position: number): Promise<Task> {
    const url = buildUrl(BASE_URL, ':taskId/move', { taskId });
    const response = await axiosApiInstance.patch(url, {
      columnId,
      position,
    });
    return response.data;
  },
};
