import type { AxiosResponse } from 'axios';
import axiosApiInstance from '../api';

export interface ApiService<Entity, CreateDTO = Partial<Entity>, UpdateDTO = Partial<Entity>> {
  getAll: () => Promise<Entity[]>;
  getById: (id: string) => Promise<Entity>;

  create: (data: CreateDTO) => Promise<Entity>;
  update: (id: string, data: UpdateDTO) => Promise<Entity>;

  delete: (id: string) => Promise<void>;
}

export const createApiService = <Entity, CreateDTO = Partial<Entity>, UpdateDTO = Partial<Entity>>(
  baseUrl: string
): ApiService<Entity, CreateDTO, UpdateDTO> => {
  return {
    async getAll(): Promise<Entity[]> {
      const response: AxiosResponse<Entity[]> = await axiosApiInstance.get(baseUrl);
      return response.data;
    },

    async getById(id: string): Promise<Entity> {
      const response: AxiosResponse<Entity> = await axiosApiInstance.get(`${baseUrl}/${id}`);
      return response.data;
    },

    async create(data: CreateDTO): Promise<Entity> {
      const response: AxiosResponse<Entity> = await axiosApiInstance.post(baseUrl, data);
      return response.data;
    },

    async update(id: string, data: UpdateDTO): Promise<Entity> {
      const response: AxiosResponse<Entity> = await axiosApiInstance.patch(
        `${baseUrl}/${id}`,
        data
      );
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await axiosApiInstance.delete(`${baseUrl}/${id}`);
    },
  };
};
