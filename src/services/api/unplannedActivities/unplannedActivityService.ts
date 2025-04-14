import { apiClient } from "../client";
import { ApiResponse, PaginatedApiResponse } from "../types";
import {
  UnplannedActivity,
  UnplannedActivityLite,
} from "@/types/unplannedActivity";
import { FilterField } from "@/types/core";
import { DEFAULT_PAGE_SIZE } from "@/config";
import { generateQueryString } from "@/utils/queryUtils";

export const unplannedActivityService = {
  /**
   * Create a new unplanned activity
   * @param data The unplanned activity data to create
   * @returns Promise with the created unplanned activity
   */
  create: async (
    data: Partial<UnplannedActivity>
  ): Promise<ApiResponse<UnplannedActivity>> => {
    try {
      const response = await apiClient.post<ApiResponse<UnplannedActivity>>(
        "/unplanned-activities",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing unplanned activity
   * @param id The unplanned activity ID
   * @param data The unplanned activity data to update
   * @returns Promise with the updated unplanned activity
   */
  update: async (
    id: number,
    data: Partial<UnplannedActivity>
  ): Promise<ApiResponse<UnplannedActivity>> => {
    try {
      const response = await apiClient.put<ApiResponse<UnplannedActivity>>(
        `/unplanned-activities/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get an unplanned activity by ID
   * @param id The unplanned activity ID
   * @returns Promise with the unplanned activity data
   */
  getById: async (id: number): Promise<ApiResponse<UnplannedActivity>> => {
    try {
      const response = await apiClient.get<ApiResponse<UnplannedActivity>>(
        `/unplanned-activities/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all unplanned activities with pagination and filtering
   * @param filters Optional filter criteria
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Promise with paginated list of unplanned activities
   */
  getUnplannedActivities: async (
    filters: FilterField[],
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedApiResponse<UnplannedActivityLite>> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      const queryString = generateQueryString(filters);

      const response = await apiClient.get<
        PaginatedApiResponse<UnplannedActivityLite>
      >(`/unplanned-activities?${queryString}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
