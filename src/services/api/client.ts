import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/config';
import { isTokenExpired } from '@/utils/jwtUtils';
import { tokenStorage } from './tokenStorage';
import { locationService } from '../location/locationService';
import appConfig from "../../../app.json";
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// List of endpoints that don't need token checks
const PUBLIC_ENDPOINTS = [
    '/auth/login',
    '/auth/refresh-token'
];

interface ApiErrorResponse {
    message?: string;
    error?: string;
}

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const appVersion = appConfig.expo.version;

const deviceInfo = {
    deviceName: Device.deviceName,
    brand: Device.brand,
    modelName: Device.modelName,
    isDevice: Device.isDevice,
    osVersion: Device.osVersion,
    osName: Platform.OS,
};

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // Skip token check for public endpoints
            if (config.url && PUBLIC_ENDPOINTS.some(endpoint => config.url?.includes(endpoint))) {
                return config;
            }

            let accessToken = await tokenStorage.getAccessToken();
            // Check if token is expired
            if (await isTokenExpired()) {
                const refreshToken = await tokenStorage.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                try {
                    // Use token manager to refresh tokens
                    const response = await tokenStorage.refreshTokens(refreshToken);
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                    // Store new tokens
                    await tokenStorage.setTokens(newAccessToken, newRefreshToken);
                    accessToken = newAccessToken;
                } catch (refreshError) {
                    // Only clear tokens if refresh token is invalid/expired
                    if ((refreshError as AxiosError)?.response?.status === 401) {
                        await tokenStorage.clearTokens();
                    }
                    throw refreshError;
                }
            }

            // Add token to request
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            const location = locationService.getCachedLocation();
            if (location) {
                config.headers['X-User-Coordinates'] = `${location.latitude},${location.longitude}`;
            }
            config.headers['X-App-Version'] = appVersion;
            config.headers['X-User-Device-Info'] = JSON.stringify(deviceInfo);

            return config;
        } catch (error) {
            // Don't clear tokens here, let the specific error handlers deal with it
            return Promise.reject(error);
        }
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling 401s
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        // Only clear tokens if it's a token-related 401
        const errorData = error.response?.data;
        if (error.response?.status === 401 && 
            (errorData?.message?.includes('token') || 
             errorData?.error?.includes('token'))) {
            await tokenStorage.clearTokens();
        }
        return Promise.reject(error);
    }
);

// export interface ApiResponse<T> {
//     success: boolean;
//     data: T;
//     message?: string;
// }