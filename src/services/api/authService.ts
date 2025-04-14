import { apiClient } from './client';
import { PLATFORM_KEY } from '@/config';
import { ApiResponse } from './types';
import { AuthTokens, UserAccess } from '@/types/auth';

interface LoginCredentials {
  mobileNo: string;
  password: string;
  appId: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  getUserPrivileges: async (): Promise<ApiResponse<UserAccess>> => {
    const response = await apiClient.get(`/auth/privileges/SR/${PLATFORM_KEY}`);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
