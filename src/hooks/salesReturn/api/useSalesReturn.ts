import { useState, useCallback } from "react";
import { SalesReturn, SalesReturnLite } from "@/types/salesReturn";
import { FilterField } from "@/types/core";
import { salesReturnService } from "@/services/api/salesReturns/salesReturnService";

interface UseSalesReturnState {
  salesReturn: SalesReturn | null;
  salesReturns: SalesReturnLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function useSalesReturn(id?: number) {
  const [state, setState] = useState<UseSalesReturnState>({
    salesReturn: null,
    salesReturns: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  const [initialReturns, setInitialReturns] = useState<SalesReturnLite[]>([]);

  const resetState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      salesReturns: initialReturns,
    }));
  }, [initialReturns]);

  const createSalesReturn = useCallback(async (data: Partial<SalesReturn>) => {
    try {
      setState((prev) => ({ ...prev, saving: true, error: null }));
      const response = await salesReturnService.createSalesReturn(data);
      setState((prev) => ({
        ...prev,
        saving: false,
        success: response.success,
        message: response.message || "Sales return created successfully",
        salesReturn: response.data,
      }));
      return response.data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        saving: false,
        success: false,
        message:
          error.response?.data?.message || "Failed to create sales return",
        error: error.response?.data?.message || "Failed to create sales return",
      }));
      throw error;
    }
  }, []);

  const fetchSalesReturn = useCallback(async (returnId: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await salesReturnService.getSalesReturnById(returnId);
      setState((prev) => ({
        ...prev,
        salesReturn: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch sales return",
      }));
      throw error;
    }
  }, []);

  const fetchSalesReturns = useCallback(
    async (filters: FilterField[] = [], loadMore = false) => {
      try {
        let nextPage = 0;
        setState((prev) => {
          nextPage = loadMore ? prev.page + 1 : 0;
          return { ...prev, loading: true, error: null };
        });

        const response = await salesReturnService.getAllSalesReturns(
          filters,
          nextPage
        );
        if (!loadMore && filters.length === 0) {
          setInitialReturns(response.data.content);
        }

        setState((prev) => ({
          ...prev,
          salesReturns: loadMore
            ? [...prev.salesReturns, ...response.data.content]
            : response.data.content,
          loading: false,
          page: response.data.pageable.pageNumber,
          hasMore: !response.data.last,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error.response?.data?.message || "Failed to fetch sales returns",
        }));
      }
    },
    []
  );

  return {
    ...state,
    createSalesReturn,
    fetchSalesReturn,
    fetchSalesReturns,
    resetState,
  };
}
