import { apiClient } from '../client';
import { ApiResponse, PaginatedApiResponse } from '../types';
import { Delivery, DeliveryLite } from '@/types/delivery';
import { FilterField } from '@/types/core';
import { DEFAULT_PAGE_SIZE } from '@/config';
import { generateQueryString } from '@/utils/queryUtils';

export const deliveryService = {
  /**
   * Get all deliveries with pagination and filtering
   * @param filters Filter criteria
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Promise with paginated list of deliveries
   */
  getDeliveries: async (
    filters: FilterField[],
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedApiResponse<DeliveryLite>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      const queryString = generateQueryString(filters);

      const response = await apiClient.get<PaginatedApiResponse<DeliveryLite>>(`/deliveries?${queryString}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a delivery by key
   * @param deliveryKey The delivery key
   * @returns Promise with the delivery data
   */
  getByKey: async (deliveryKey: number): Promise<ApiResponse<Delivery>> => {
    try {
      const response = await apiClient.get<ApiResponse<Delivery>>(`/deliveries/${deliveryKey}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirm a delivery
   * @param deliveryKey The delivery key
   * @param data The delivery data to update
   * @returns Promise with success message
   */
  confirmDelivery: async (deliveryKey: number, data: Partial<Delivery>): Promise<ApiResponse<Delivery>> => {
    try {
      const response = await apiClient.put<ApiResponse<Delivery>>(`/deliveries/${deliveryKey}/confirm`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
