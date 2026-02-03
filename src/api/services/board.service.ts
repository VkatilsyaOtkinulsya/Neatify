import { buildUrl, createApiService } from '@/api/client/api.factory';
import type { Board, BoardColumn } from '../../features/board/types/project.types';
import axiosApiInstance from '@/api/api';

const BASE_URL = import.meta.env.VITE_API_B0ARDS_URL;

const baseService = createApiService<Board>(BASE_URL);

export const BoardService = {
  ...baseService,

  async getByWorkspace(workspaceId: string): Promise<Board[]> {
    const url = buildUrl(BASE_URL, 'workspaces/:workspaceId/boards', { workspaceId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async getById(boardId: string): Promise<Board> {
    const url = buildUrl(BASE_URL, ':boardId', { boardId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async createInWorkspace(workspaceId: string, data: Partial<Board>): Promise<Board> {
    const url = buildUrl(BASE_URL, 'workspaces/:workspaceId/boards', { workspaceId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async createBoardColumn(boardId: string, data: Partial<BoardColumn>): Promise<Board> {
    const url = buildUrl(BASE_URL, ':boardId/addColumn', { boardId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },
};
