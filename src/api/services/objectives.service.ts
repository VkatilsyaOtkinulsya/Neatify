import axiosApiInstance from '@/api/api';
import { buildUrl } from '@/shared/lib/utils/buildUrl';
import type {
  Objective,
  CreateObjectiveDto,
  UpdateObjectiveDto,
  CreateKeyResultDto,
  UpdateKeyResultDto,
  UpdateMetricDto,
} from '@/features/okr/types/okr.types';

const BASE_URL = import.meta.env.VITE_API_OKR_URL;

export const ObjectivesService = {
  async getAll(workspaceId: string): Promise<{ objectives: Objective[]; totalCount: number }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives', { workspaceId });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async getById(workspaceId: string, objectiveId: string): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId', {
      workspaceId,
      objectiveId,
    });
    const response = await axiosApiInstance.get(url);
    return response.data;
  },

  async create(workspaceId: string, data: CreateObjectiveDto): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives', { workspaceId });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async update(
    workspaceId: string,
    objectiveId: string,
    data: UpdateObjectiveDto
  ): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId', {
      workspaceId,
      objectiveId,
    });
    const response = await axiosApiInstance.patch(url, data);
    return response.data;
  },

  async delete(workspaceId: string, objectiveId: string): Promise<{ message: string }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId', {
      workspaceId,
      objectiveId,
    });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },

  async addKeyResult(
    workspaceId: string,
    objectiveId: string,
    data: CreateKeyResultDto
  ): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId/key-results', {
      workspaceId,
      objectiveId,
    });
    const response = await axiosApiInstance.post(url, data);
    return response.data;
  },

  async updateKeyResult(
    workspaceId: string,
    objectiveId: string,
    krId: string,
    data: UpdateKeyResultDto
  ): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId/key-results/:krId', {
      workspaceId,
      objectiveId,
      krId,
    });
    const response = await axiosApiInstance.patch(url, data);
    return response.data;
  },

  async deleteKeyResult(
    workspaceId: string,
    objectiveId: string,
    krId: string
  ): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId/key-results/:krId', {
      workspaceId,
      objectiveId,
      krId,
    });
    const response = await axiosApiInstance.delete(url);
    return response.data;
  },

  async startKeyResult(
    workspaceId: string,
    objectiveId: string,
    krId: string
  ): Promise<{ objective: Objective }> {
    const url = buildUrl(BASE_URL, ':workspaceId/objectives/:objectiveId/key-results/:krId/start', {
      workspaceId,
      objectiveId,
      krId,
    });
    const response = await axiosApiInstance.post(url);
    return response.data;
  },

  async updateMetric(
    workspaceId: string,
    objectiveId: string,
    krId: string,
    data: UpdateMetricDto
  ): Promise<{ objective: Objective }> {
    const url = buildUrl(
      BASE_URL,
      ':workspaceId/objectives/:objectiveId/key-results/:krId/metric',
      {
        workspaceId,
        objectiveId,
        krId,
      }
    );
    const response = await axiosApiInstance.patch(url, data);
    return response.data;
  },
};
