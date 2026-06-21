import { createApiService } from '@/api/client/api.factory';
import type {
  AddMemberPayload,
  Board,
  BoardColumn,
  ProjectDetails,
} from '../../features/board/types/board.types';
import axiosApiInstance from '@/api/api';
import type { IBoardMemberApi } from '@/shared/types/user.types';
import { buildUrl } from '@/shared/lib/utils/buildUrl';
import type { AddMemberResponse } from '../types/api.types';
import type {
  ContributorsResponse,
  MyContributorResponse,
} from '../../features/board/types/contributor.types';

const BASE_URL = import.meta.env.VITE_API_B0ARDS_URL;

const baseService = createApiService<Board>(BASE_URL);

export const BoardService = {
  ...baseService,

  async getByWorkspace(workspaceId: string): Promise<Board[]> {
    const url = buildUrl(BASE_URL, 'workspaces/:workspaceId/boards', { workspaceId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async getById(boardId: string): Promise<ProjectDetails> {
    const url = buildUrl(BASE_URL, ':boardId', { boardId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async createInWorkspace(workspaceId: string, data: Partial<Board>): Promise<Board> {
    const url = buildUrl(BASE_URL, 'workspaces/:workspaceId/boards', { workspaceId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async addMember(boardId: string, payload: AddMemberPayload): Promise<AddMemberResponse> {
    const url = buildUrl(BASE_URL, ':boardId/members', { boardId });
    const response = await axiosApiInstance.post(url, payload);
    return response.data;
  },

  async removeMember(boardId: string, userId: string): Promise<void> {
    const url = buildUrl(BASE_URL, `:boardId/members/:userId`, { boardId, userId });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },

  async createBoardColumn(boardId: string, data: Partial<BoardColumn>): Promise<Board> {
    const url = buildUrl(BASE_URL, ':boardId/columns', { boardId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async moveColumn(boardId: string, columnId: string, data: Partial<BoardColumn>): Promise<Board> {
    const url = buildUrl(BASE_URL, ':boardId/columns/:columnId', { boardId, columnId });
    const response = await axiosApiInstance.patch(url, data);
    return response.data;
  },

  async updateColumn(
    boardId: string,
    columnId: string,
    data: Partial<BoardColumn>
  ): Promise<BoardColumn> {
    const url = buildUrl(BASE_URL, ':boardId/columns/:columnId', { boardId, columnId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async deleteColumn(boardId: string, columnId: string): Promise<BoardColumn> {
    const url = buildUrl(BASE_URL, ':boardId/columns/:columnId', { boardId, columnId });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },

  async getProjectUsers(boardId: string): Promise<IBoardMemberApi[]> {
    const url = buildUrl(BASE_URL, ':boardId/members', { boardId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async getContributors(
    boardId: string,
    from: string,
    to: string,
  ): Promise<ContributorsResponse> {
    const query = new URLSearchParams({ from, to });
    const url =
      buildUrl(BASE_URL, ':id/contributors', { id: boardId }) +
      `?${query.toString()}`;
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async getMyContributorStats(
    boardId: string,
    from: string,
    to: string,
  ): Promise<MyContributorResponse> {
    const query = new URLSearchParams({ from, to });
    const url =
      buildUrl(BASE_URL, ':id/contributors/me', { id: boardId }) +
      `?${query.toString()}`;
    const response = await axiosApiInstance.get(url);
    return response.data;
  },
};
