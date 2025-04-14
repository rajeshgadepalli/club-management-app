import { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { FilterField, FilterOperator } from "@/types/core";
import { FilterReturnType } from "@/types/commonFilter";
import { useExpense } from "../api/useExpense";

export function useExpenseList() {
  const navigation = useNavigation();
  const [showFilter, setShowFilter] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [commonFilter, setCommonFilter] = useState<{ [key: string]: any }>({});

  const { expenses, loading, error, hasMore, fetchExpenses } = useExpense();

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // No API call, just filter the existing expenses
  }, []);

  // Filter handler
  const handleFilter = useCallback(
    (filters: any) => {
      const apiFilters: FilterField[] = [];

      // Convert date filter to API format
      if (filters.fromDate && filters.toDate) {
        apiFilters.push({
          field: FilterReturnType.DATE_DROPDOWN_EXPENSE_KEY,
          operator: FilterOperator.GTE,
          value: filters.fromDate,
        });
        apiFilters.push({
          field: FilterReturnType.DATE_DROPDOWN_EXPENSE_KEY,
          operator: FilterOperator.LTE,
          value: filters.toDate,
        });
      }

      setCommonFilter(filters);
      setShowFilter(false);
      fetchExpenses(apiFilters);
    },
    [fetchExpenses]
  );

  // Navigation handlers
  const handleAddExpense = useCallback(() => {
    navigation.navigate("ExpenseForm");
  }, [navigation]);

  const handleEditExpense = useCallback(
    (expenseId: number) => {
      navigation.navigate("ExpenseForm", { id: expenseId });
    },
    [navigation]
  );

  // List handlers
  const handleRefresh = useCallback(() => {
    fetchExpenses([]);
  }, [fetchExpenses]);

  const handleEndReached = useCallback(() => {
    // Don't load more if we're searching
    if (!loading && hasMore && !searchQuery.trim()) {
      fetchExpenses([], true); // Load more with current filters
    }
  }, [loading, hasMore, searchQuery, fetchExpenses]);

  // Filter dealers based on search
  const filteredExpenses = expenses?.filter((expense) =>
    !searchQuery.trim()
      ? true
      : expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    // List state
    expenses: filteredExpenses,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,

    // List actions
    handleSearch,
    handleFilter,
    handleAddExpense,
    handleEditExpense,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    fetchExpenses,
  };
}
