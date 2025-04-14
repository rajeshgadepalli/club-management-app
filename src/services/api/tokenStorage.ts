import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage';
import { API_URL } from '@/config';
import { AuthTokens } from '@/types/auth';
import { ApiResponse } from './types';

// Create a separate instance for token refresh to avoid circular dependency
const tokenClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const tokenStorage = {
    getAccessToken: () => AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),

    getRefreshToken: () => AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),

    setTokens: async (accessToken: string, refreshToken: string) => {
        await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
            AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        ]);
    },

    clearTokens: async () => {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
        ]);
    },

    refreshTokens: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
        const response = await tokenClient.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },
};
