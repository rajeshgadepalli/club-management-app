import { apiClient } from '../client';
import { ApiResponse, PaginatedApiResponse } from '../types';
import { Payment, PaymentLite } from '@/types/payment';
import { FilterField } from '@/types/core';
import { DEFAULT_PAGE_SIZE } from '@/config';
import { generateQueryString } from '@/utils/queryUtils';

export const paymentService = {
  /**
   * Create a new payment
   * @param data The payment data to create
   * @returns Promise with the created payment
   */
  create: async (data: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>('/payments', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a payment by ID
   * @param id The payment ID
   * @returns Promise with the payment data
   */
  getById: async (id: number): Promise<ApiResponse<Payment>> => {
    try {
      const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all payments with pagination and filtering
   * @param filters Optional filter criteria
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Promise with paginated list of payments
   */
  getPayments: async (filters: FilterField[], page: number = 0, size: number = DEFAULT_PAGE_SIZE): Promise<PaginatedApiResponse<PaymentLite>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      const queryString = generateQueryString(filters);

      const response = await apiClient.get<PaginatedApiResponse<PaymentLite>>(`/payments?${queryString}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
