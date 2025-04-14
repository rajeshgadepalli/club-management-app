import { useState, useCallback } from "react";
import { FilterField } from "@/types/core";
import { Expense, ExpenseLite } from "@/types/expense";
import { expenseService } from "@/services/api/expenses/expenseService";

interface UseExpenseState {
  expense: Expense | null;
  expenses: ExpenseLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function useExpense(id?: number) {
  const [state, setState] = useState<UseExpenseState>({
    expense: null,
    expenses: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  // Store initial data separately to avoid unnecessary API calls
  const [initialExpenses, setInitialExpenses] = useState<ExpenseLite[]>([]);

  const resetState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      expenses: initialExpenses, // Reset to initial data
    }));
  }, [initialExpenses]);

  const createExpense = useCallback(async (data: Partial<Expense>) => {
    try {
      setState((prev) => ({ ...prev, saving: true, error: null }));
      const response = await expenseService.create(data);

      setState((prev) => ({
        ...prev,
        saving: false,
        success: response.success,
        message: response.message || "Expense created successfully",
        expense: response.data,
      }));
      return response.data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        saving: false,
        success: false,
        message: error.response?.data?.message || "Failed to create expense",
        error: error.response?.data?.message || "Failed to create expense",
      }));
      throw error;
    }
  }, []);

  const updateExpense = useCallback(
    async (data: Partial<Expense> & { id: number }) => {
      try {
        setState((prev) => ({ ...prev, saving: true, error: null }));
        const response = await expenseService.update(data.id, data);
        setState((prev) => ({
          ...prev,
          saving: false,
          success: response.success,
          message: response.message || "Expense updated successfully",
          expense: response.data,
        }));
        return response.data;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          saving: false,
          success: false,
          message: error.response?.data?.message || "Failed to update expense",
          error: error.response?.data?.message || "Failed to update expense",
        }));
        throw error;
      }
    },
    []
  );

  const fetchExpense = useCallback(async (expenseId: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await expenseService.getById(expenseId);
      setState((prev) => ({
        ...prev,
        expense: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch expense",
      }));
      throw error;
    }
  }, []);

  const fetchExpenses = useCallback(
    async (filters: FilterField[] = [], loadMore: boolean = false) => {
      try {
        let nextPage = 0;
        setState((prev) => {
          nextPage = loadMore ? prev.page + 1 : 0;
          return { ...prev, loading: true, error: null };
        });

        const response = await expenseService.getExpenses(filters, nextPage);

        // If this is initial load or filter change, save as initial data
        if (!loadMore && filters.length === 0) {
          setInitialExpenses(response.data.content);
        }

        setState((prev) => ({
          ...prev,
          expenses: loadMore
            ? [...prev.expenses, ...response.data.content]
            : response.data.content,
          loading: false,
          page: response.data.pageable.pageNumber,
          hasMore: !response.data.last,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to fetch expenses",
        }));
      }
    },
    []
  );

  return {
    ...state,
    createExpense,
    updateExpense,
    fetchExpense,
    fetchExpenses,
    resetState,
  };
}
