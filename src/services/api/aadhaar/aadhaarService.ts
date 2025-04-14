import { apiClient } from '../client';
import { AadhaarFrontData, AadhaarBackData, AadhaarScanRequest } from '@/types/aadhaar';
import { ApiResponse } from '../types';

export const aadhaarService = {
  /**
   * Extract Aadhaar front side data
   * @param request Aadhaar scan request for front side
   * @returns Promise with Aadhaar front data
   */
  extractFront: async (request: AadhaarScanRequest): Promise<ApiResponse<AadhaarFrontData>> => {
    try {
      const response = await apiClient.post<ApiResponse<AadhaarFrontData>>('/aadhaar/extract', request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Extract Aadhaar back side data
   * @param request Aadhaar scan request for back side
   * @returns Promise with Aadhaar back data
   */
  extractBack: async (request: AadhaarScanRequest): Promise<ApiResponse<AadhaarBackData>> => {
    try {
      const response = await apiClient.post<ApiResponse<AadhaarBackData>>('/aadhaar/extract', request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
