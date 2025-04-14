import { apiClient, ApiResponse } from "../client";
import { PaginatedApiResponse, PaginatedContent } from "../types";
import { FilterField } from "@/types/core";
import { DEFAULT_PAGE_SIZE } from "@/config";
import { generateQueryString } from "@/utils/queryUtils";
import { Expense, ExpenseLite } from "@/types/expense";

export const expenseService = {
  /**
   * Create a new dealer
   * @param data The dealer data to create
   * @returns Promise with the created dealer
   */
  create: async (data: Partial<Expense>): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiClient.post<ApiResponse<Expense>>(
        "/expenses",
        data
      );
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
  update: async (
    id: number,
    data: Partial<Expense>
  ): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiClient.put<ApiResponse<Expense>>(
        `/expenses/${id}`,
        data
      );
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
  getById: async (id: number): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiClient.get<ApiResponse<Expense>>(
        `/expenses/${id}`
      );
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
  getExpenses: async (
    filters: FilterField[],
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedApiResponse<ExpenseLite>> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      const queryString = generateQueryString(filters);

      const response = await apiClient.get<PaginatedApiResponse<ExpenseLite>>(
        `/expenses?${queryString}`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
