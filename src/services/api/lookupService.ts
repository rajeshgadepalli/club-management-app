import { Lookup, Region } from '@/types/core';
import { apiClient } from './client';
import { ApiResponse } from './types';

export const lookupService = {
    getLookupsByCategories: async (categories: string[]): Promise<ApiResponse<Lookup[]>> => {
        const queryParams = categories.map(category => `categories=${encodeURIComponent(category)}`).join('&');
        const response = await apiClient.get(`/lookups?${queryParams}`);
        return response.data;
    },

    getRegions: async (): Promise<ApiResponse<Region[]>> => {
        const response = await apiClient.get('/lookups/regions');
        return response.data;
    },
};
