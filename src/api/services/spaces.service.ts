import type { Workspace } from '@/features/workspace/types/workspace.types';
import axiosApiInstance from '@/api/api';
import { buildUrl, createApiService } from '@/api/client/api.factory';

const BASE_URL = import.meta.env.VITE_API_WORKSPACES_URL;

const baseService = createApiService<Workspace>(BASE_URL);

export const WorkpacesService = {
  ...baseService,
  async getUserWorkspaces(): Promise<Workspace[]> {
    const response = await axiosApiInstance.get(BASE_URL);
    return response.data;
  },

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    const url = buildUrl(BASE_URL, ':id', { id: workspaceId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async addMember(workspaceId: string, userId: string): Promise<Workspace> {
    const url = buildUrl(BASE_URL, ':id/members', { id: workspaceId });
    const response = await axiosApiInstance.post(url, { userId });
    return response.data;
  },

  async removeMember(workspaceId: string, userId: string): Promise<Workspace> {
    const url = buildUrl(BASE_URL, ':id/members/:userId', { id: workspaceId, userId });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },
};
