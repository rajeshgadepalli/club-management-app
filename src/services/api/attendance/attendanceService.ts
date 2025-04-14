import { apiClient } from '../client';
import { Attendance } from '@/types/attendance';
import { ApiResponse } from '../types';
import { convertToISTDate } from '@/utils/dateUtils';

const BASE_URL = '/attendance';

export const attendanceService = {
  markTimeIn: async (attendance: Attendance): Promise<ApiResponse<Attendance>> => {
    const response = await apiClient.post<ApiResponse<Attendance>>(`${BASE_URL}/mark-timein`, attendance);
    return response.data;
  },

  markTimeOut: async (attendance: Attendance): Promise<ApiResponse<Attendance>> => {
    const response = await apiClient.post<ApiResponse<Attendance>>(`${BASE_URL}/mark-timeout`, attendance);
    return response.data;
  },

  getAttendanceByDate: async (userId: number, date: Date): Promise<ApiResponse<Attendance>> => {
    const formattedDate = convertToISTDate(date);
    const response = await apiClient.get(`${BASE_URL}/by-user/${userId}/by-date/${formattedDate}`);
    return response.data;
  },
};
