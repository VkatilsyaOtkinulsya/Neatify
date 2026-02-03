import type { AuthResponse, RegisterRequest, LoginRequest } from '@/api/types/api.types';
import { handleApiError } from '@/shared/lib/utils/error-handler';
import axiosApiInstance from '@/api/api';

const AUTH_URL = import.meta.env.VITE_API_AUTH_URL;

export const AuthService = {
  async signUp(data: RegisterRequest): Promise<AuthResponse> {
    return await this._authRequest({ AuthRequest: data, endpoint: 'register' });
  },

  async signIn(data: LoginRequest): Promise<AuthResponse> {
    const response = await this._authRequest({ AuthRequest: data, endpoint: 'login' });
    return response;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await axiosApiInstance.post(`${AUTH_URL}/refresh`, { refreshToken });
    return response.data;
  },

  async _authRequest(
    payload:
      | {
          AuthRequest: LoginRequest;
          endpoint: 'login';
        }
      | {
          AuthRequest: RegisterRequest;
          endpoint: 'register';
        }
  ): Promise<AuthResponse> {
    try {
      const response = await axiosApiInstance.post(
        `${AUTH_URL}/${payload.endpoint}`,
        {
          ...payload.AuthRequest,
          returnSecureToken: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (err) {
      handleApiError(err, {
        context: 'Auth Error:',
        silent: true,
      });
      throw err;
    }
  },
};
