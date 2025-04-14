import { apiClient } from '../client';
import { ApiResponse, PaginatedApiResponse, PaginatedContent } from '../types';
import { Dealer, DealerLite } from '@/types/dealer';
import { FilterField } from '@/types/core';
import { DEFAULT_PAGE_SIZE } from '@/config';
import { generateQueryString } from '@/utils/queryUtils';

export const dealerService = {
  /**
   * Create a new dealer
   * @param data The dealer data to create
   * @returns Promise with the created dealer
   */
  create: async (data: Partial<Dealer>): Promise<ApiResponse<Dealer>> => {
    try {
      const response = await apiClient.post<ApiResponse<Dealer>>('/dealers', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing dealer
   * @param id The dealer ID
   * @param data The dealer data to update
   * @returns Promise with the updated dealer
   */
  update: async (id: number, data: Partial<Dealer>): Promise<ApiResponse<Dealer>> => {
    try {
      const response = await apiClient.put<ApiResponse<Dealer>>(`/dealers/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a dealer by ID
   * @param id The dealer ID
   * @returns Promise with the dealer data
   */
  getById: async (id: number): Promise<ApiResponse<Dealer>> => {
    try {
      const response = await apiClient.get<ApiResponse<Dealer>>(`/dealers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all dealers with pagination and filtering
   * @param page Page number (0-based)
   * @param size Page size
   * @param filters Optional filter criteria
   * @returns Promise with paginated list of dealers
   */
  getDealers: async (filters: FilterField[], page: number = 0, size: number = DEFAULT_PAGE_SIZE): Promise<PaginatedApiResponse<DealerLite>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      const queryString = generateQueryString(filters);

      const response = await apiClient.get<PaginatedApiResponse<DealerLite>>(`/dealers?${queryString}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
