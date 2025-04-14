import { apiClient } from '../client';
import { AgentActivitySummary } from '@/types/agentActivitySummary';
import { ApiResponse } from '../types';
import { convertToISTDate } from '@/utils/dateUtils';

const BASE_URL = '/users';

export const agentActivitySummaryService = {
    getActivitySummary: async (userId: number, activityDate: Date): Promise<ApiResponse<AgentActivitySummary>> => {
        const formattedDate = convertToISTDate(activityDate);

        const url = `${BASE_URL}/${userId}/activity-summary?activityDate=${formattedDate}`;

        const response = await apiClient.get(url);
        return response.data;
    },

    getActivitySummaryRange: async (
        userId: number,
        fromDate: Date,
        toDate: Date
    ): Promise<ApiResponse<AgentActivitySummary[]>> => {
        const formattedFromDate = convertToISTDate(fromDate);
        const formattedToDate = convertToISTDate(toDate);

        const url = `${BASE_URL}/${userId}/activity-summary/range?fromDate=${formattedFromDate}&toDate=${formattedToDate}`;

        const response = await apiClient.get(url);
        return response.data;
    }
};
