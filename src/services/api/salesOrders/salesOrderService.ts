import { apiClient } from '../client';
import { SalesOrder, SalesOrderLite } from '@/types/salesOrder';
import { FilterField } from '@/types/core';
import { DEFAULT_PAGE_SIZE } from '@/config';
import { generateQueryString } from '@/utils/queryUtils';
import { ApiResponse, PaginatedApiResponse } from '../types';

export const salesOrderService = {
  /**
   * Get all sales orders with optional filters and pagination
   * @param filters Optional filters
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Paginated response with sales orders
   */
  getAllSalesOrders: async (
    filters: FilterField[] = [],
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedApiResponse<SalesOrderLite>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      const queryString = generateQueryString(filters);
      const response = await apiClient.get<PaginatedApiResponse<SalesOrderLite>>(
        `/sales-orders?${queryString}`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new sales order
   * @param data Sales order data
   * @returns Created sales order
   */
  createSalesOrder: async (data: Partial<SalesOrder>): Promise<ApiResponse<SalesOrder>> => {
    try {
      const response = await apiClient.post<ApiResponse<SalesOrder>>('/sales-orders', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get sales order by ID (key)
   * @param orderKey Sales order key
   * @returns Sales order details
   */
  getSalesOrderById: async (orderKey: number): Promise<ApiResponse<SalesOrder>> => {
    try {
      const response = await apiClient.get<ApiResponse<SalesOrder>>(`/sales-orders/${orderKey}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
