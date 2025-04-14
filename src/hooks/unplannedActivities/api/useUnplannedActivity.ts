import { useState, useCallback } from "react";
import { unplannedActivityService } from "@/services/api/unplannedActivities/unplannedActivityService";
import {
  UnplannedActivity,
  UnplannedActivityLite,
} from "@/types/unplannedActivity";
import { FilterField } from "@/types/core";

interface UseUnplannedActivityState {
  activity: UnplannedActivity | null;
  activities: UnplannedActivityLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function useUnplannedActivity(id?: number) {
  const [state, setState] = useState<UseUnplannedActivityState>({
    activity: null,
    activities: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  const [initialActivities, setInitialActivities] = useState<
    UnplannedActivityLite[]
  >([]);

  const resetState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      activities: initialActivities,
    }));
  }, [initialActivities]);

  const createActivity = useCallback(
    async (data: Partial<UnplannedActivity>) => {
      try {
        setState((prev) => ({ ...prev, saving: true, error: null }));
        const response = await unplannedActivityService.create(data);
        setState((prev) => ({
          ...prev,
          saving: false,
          success: response.success,
          message: response.message || "Activity created successfully",
          activity: response.data,
        }));
        return response.data;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          saving: false,
          success: false,
          message: error.response?.data?.message || "Failed to create activity",
          error: error.response?.data?.message || "Failed to create activity",
        }));
        throw error;
      }
    },
    []
  );

  const updateActivity = useCallback(
    async (data: Partial<UnplannedActivity> & { id: number }) => {
      try {
        setState((prev) => ({ ...prev, saving: true, error: null }));
        const response = await unplannedActivityService.update(data.id, data);
        setState((prev) => ({
          ...prev,
          saving: false,
          success: response.success,
          message: response.message || "Activity updated successfully",
          activity: response.data,
        }));
        console.log("response:", response);
        return response.data;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          saving: false,
          success: false,
          message: error.response?.data?.message || "Failed to update activity",
          error: error.response?.data?.message || "Failed to update activity",
        }));
        throw error;
      }
    },
    []
  );

  const fetchActivity = useCallback(async (activityId: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await unplannedActivityService.getById(activityId);
      setState((prev) => ({
        ...prev,
        activity: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch activity",
      }));
      throw error;
    }
  }, []);

  const fetchActivities = useCallback(
    async (filters: FilterField[] = [], loadMore: boolean = false) => {
      try {
        let nextPage = 0;
        setState((prev) => {
          nextPage = loadMore ? prev.page + 1 : 0;
          return { ...prev, loading: true, error: null };
        });

        const response = await unplannedActivityService.getUnplannedActivities(
          filters,
          nextPage
        );

        if (!loadMore && filters.length === 0) {
          setInitialActivities(response.data.content);
        }

        setState((prev) => ({
          ...prev,
          activities: loadMore
            ? [...prev.activities, ...response.data.content]
            : response.data.content,
          loading: false,
          page: response.data.pageable.pageNumber,
          hasMore: !response.data.last,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to fetch activities",
        }));
      }
    },
    []
  );

  return {
    ...state,
    createActivity,
    updateActivity,
    fetchActivity,
    fetchActivities,
    resetState,
  };
}
