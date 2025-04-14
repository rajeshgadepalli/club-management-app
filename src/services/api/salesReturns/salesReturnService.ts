import { apiClient } from "../client";
import { SalesReturn, SalesReturnLite } from "@/types/salesReturn";
import { FilterField } from "@/types/core";
import { DEFAULT_PAGE_SIZE } from "@/config";
import { generateQueryString } from "@/utils/queryUtils";
import { ApiResponse, PaginatedApiResponse } from "../types";

export const salesReturnService = {
  /**
   * Get all sales returns with optional filters and pagination
   * @param filters Optional filters
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Paginated response with sales returns
   */
  getAllSalesReturns: async (
    filters: FilterField[] = [],
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedApiResponse<SalesReturnLite>> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      const queryString = generateQueryString(filters);
      const response = await apiClient.get<
        PaginatedApiResponse<SalesReturnLite>
      >(`/sales-returns?${queryString}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new sales return
   * @param data Sales return data
   * @returns Created sales return
   */
  createSalesReturn: async (
    data: Partial<SalesReturn>
  ): Promise<ApiResponse<SalesReturn>> => {
    try {
      const response = await apiClient.post<ApiResponse<SalesReturn>>(
        "/sales-returns",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get sales return by ID
   * @param returnId Sales return ID
   * @returns Sales return details
   */
  getSalesReturnById: async (
    returnId: number
  ): Promise<ApiResponse<SalesReturn>> => {
    try {
      const response = await apiClient.get<ApiResponse<SalesReturn>>(
        `/sales-returns/${returnId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
