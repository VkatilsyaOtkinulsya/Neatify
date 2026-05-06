import { useAuthStore } from '@/stores/auth.store';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import router from '@/router';
import { handleApiError } from '@/shared/lib/utils/error-handler';

const API_URL = import.meta.env.VITE_API_URL;
const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;

const PUBLIC_URLS = [
  `${API_AUTH_URL}${import.meta.env.VITE_API_AUTH_REGISTER_URL}`,
  `${API_AUTH_URL}${import.meta.env.VITE_API_AUTH_LOGIN_URL}`,
];

const isPublic = (url?: string) => {
  if (!url) return false;
  return PUBLIC_URLS.some((publicUrl) => url.includes(publicUrl));
};

const axiosApiInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isPublic(config.url)) return config;

    const authStore = useAuthStore();
    const token = authStore.userInfo?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async function (error) {
    const authStore = useAuthStore();
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (isPublic(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStore.userInfo?.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_AUTH_URL}/refresh`, {
          refreshToken: refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        authStore.userInfo.accessToken = newToken;
        authStore.userInfo.refreshToken = newRefreshToken;

        localStorage.setItem(
          'userTokens',
          JSON.stringify({
            accessToken: newToken,
            refreshToken: newRefreshToken,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosApiInstance(originalRequest);
      } catch (err) {
        authStore.logout();
        localStorage.removeItem('userTokens');
        router.push('/signin');

        return Promise.reject(err);
      }
    }

    handleApiError(error);

    return Promise.reject(error);
  }
);

export default axiosApiInstance;
