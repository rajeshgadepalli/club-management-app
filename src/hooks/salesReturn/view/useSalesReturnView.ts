// hooks/salesReturn/view/useSalesReturnView.ts

import { useState, useCallback } from "react";
import { SalesReturn } from "@/types/salesReturn";
import { salesReturnService } from "@/services/api/salesReturns/salesReturnService";

interface UseSalesReturnViewState {
  salesReturn: SalesReturn | null;
  isLoading: boolean;
  error: string | null;
}

export const useSalesReturnView = (returnId: number) => {
  const [state, setState] = useState<UseSalesReturnViewState>({
    salesReturn: null,
    isLoading: false,
    error: null,
  });

  const fetchSalesReturn = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await salesReturnService.getSalesReturnById(returnId);

      setState((prev) => ({
        ...prev,
        salesReturn: response.data,
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load sales return";
      setState((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    }
  }, [returnId]);

  return {
    ...state,
    fetchSalesReturn,
  };
};
