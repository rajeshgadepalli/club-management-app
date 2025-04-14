import { useState, useCallback } from "react";
import { lookupService } from "@/services/api/lookupService";
import { Lookup, Region } from "@/types/core";

interface UseLookupState {
  lookups: Lookup[] | null;
  regions: Region[];
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

export const useLookup = () => {
  const [state, setState] = useState<UseLookupState>({
    lookups: null,
    regions: [],
    loading: false,
    error: null,
    message: null,
    success: false,
  });

  const fetchLookupsByCategories = useCallback(async (categories: string[]) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));
      const response = await lookupService.getLookupsByCategories(categories);
      setState((prev) => ({
        ...prev,
        lookups: response.data,
        loading: false,
        success: true,
        message: "Lookups fetched successfully",
      }));
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch lookups";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));
      throw err;
    }
  }, []);

  const fetchAllLookups = useCallback(async () => {
    return await fetchLookupsByCategories([]);
  }, [fetchLookupsByCategories]);

  const fetchRegions = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));
      const response = await lookupService.getRegions();
      setState((prev) => ({
        ...prev,
        regions: response.data,
        loading: false,
        success: true,
        message: "Regions fetched successfully",
      }));
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch regions";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));
      throw err;
    }
  }, []);

  return {
    ...state,
    fetchLookupsByCategories,
    fetchRegions,
    fetchAllLookups,
  };
};
