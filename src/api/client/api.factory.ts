import type { AxiosResponse } from 'axios';
import axiosApiInstance from '../api';

const replaceParams = (template: string, params: Record<string, string | number>): string => {
  let url = template;

  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });

  return url;
};

/**
 * Builds a URL by replacing template params with provided values and
 * prepending the base URL.
 *
 * @param {string} base - The base URL.
 * @param {string} template - The URL template.
 * @param {Record<string, string | number>} params - The params to replace in the template.
 * @return {string} The built URL.
 */
export const buildUrl = (
  base: string,
  template: string,
  params: Record<string, string | number>
): string => {
  const url = params ? replaceParams(template, params) : template;
  return `${base}/${url}`;
};

export interface ApiService<T> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

/**
 * Creates an API service for CRUD operations on a given resource.
 *
 * @template T
 * @param {string} baseUrl - The base URL of the API.
 * @returns {ApiService<T>} - An API service for CRUD operations on the given resource.
 */
export const createApiService = <T>(baseUrl: string): ApiService<T> => {
  return {
    async getAll(): Promise<T[]> {
      const response: AxiosResponse<T[]> = await axiosApiInstance.get(baseUrl);
      return response.data;
    },

    async getById(id: string): Promise<T> {
      const response: AxiosResponse<T> = await axiosApiInstance.get(`${baseUrl}/${id}`);
      return response.data;
    },

    async create(data: Partial<T>): Promise<T> {
      const response: AxiosResponse<T> = await axiosApiInstance.post(baseUrl, data);
      return response.data;
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      const response: AxiosResponse<T> = await axiosApiInstance.patch(`${baseUrl}/${id}`, data);
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await axiosApiInstance.delete(`${baseUrl}/${id}`);
    },
  };
};
