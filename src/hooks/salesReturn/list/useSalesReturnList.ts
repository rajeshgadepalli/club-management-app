import { useState, useCallback, useEffect, useMemo } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSalesReturn } from "../api/useSalesReturn";
import { FilterField, FilterOperator } from "@/types/core";
import { FilterReturnType } from "@/types/commonFilter";
import { Dealer } from "@/types/dealer";

export function useSalesReturnList(dealer?: Dealer) {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [showFilter, setShowFilter] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [commonFilter, setCommonFilter] = useState<{ [key: string]: any }>({});

  const {
    salesReturns,
    loading,
    error,
    hasMore,
    fetchSalesReturns,
    resetState,
  } = useSalesReturn();

  const initialFilters: FilterField[] = useMemo(
    () => route?.params?.filters || [],
    [route?.params?.filters]
  );

  const initialFetch = useCallback(() => {
    const filters: FilterField[] = [...initialFilters];
    if (dealer) {
      filters.push({
        field: "dealer.id",
        operator: FilterOperator.EQ,
        value: dealer.id,
      });
    }
    fetchSalesReturns(filters);
  }, [dealer, fetchSalesReturns, initialFilters]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback(
    (filters: any) => {
      const apiFilters: FilterField[] = [];

      if (dealer) {
        apiFilters.push({
          field: "dealer.id",
          operator: FilterOperator.EQ,
          value: dealer.id,
        });
      }

      if (filters.fromDate && filters.toDate) {
        apiFilters.push({
          field: "returnDate",
          operator: FilterOperator.GTE,
          value: filters.fromDate,
        });
        apiFilters.push({
          field: "returnDate",
          operator: FilterOperator.LTE,
          value: filters.toDate,
        });
      }

      setCommonFilter(filters);
      setShowFilter(false);
      fetchSalesReturns(apiFilters);
    },
    [fetchSalesReturns, dealer]
  );

  const handleAddReturn = useCallback(() => {
    navigation.navigate("SalesReturnForm", { dealer });
  }, [navigation, dealer]);

  const handleViewReturn = useCallback(
    (id: number) => {
      navigation.navigate("ViewSalesReturn", { id });
    },
    [navigation]
  );

  const handleRefresh = useCallback(() => {
    const filters: FilterField[] = [];
    if (dealer) {
      filters.push({
        field: "dealer.id",
        operator: FilterOperator.EQ,
        value: dealer.id,
      });
    }
    fetchSalesReturns(filters);
  }, [fetchSalesReturns, dealer]);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore && !searchQuery.trim()) {
      const filters: FilterField[] = [];
      if (dealer) {
        filters.push({
          field: "dealer.id",
          operator: FilterOperator.EQ,
          value: dealer.id,
        });
      }
      fetchSalesReturns(filters, true);
    }
  }, [loading, hasMore, searchQuery, fetchSalesReturns, dealer]);

  const filteredSalesReturns = salesReturns?.filter((ret) =>
    !searchQuery.trim()
      ? true
      : ret.returnNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.dealerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.reasonName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    salesReturns: filteredSalesReturns,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    handleSearch,
    handleFilter,
    handleAddReturn,
    handleViewReturn,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    fetchSalesReturns,
    clearError,
  };
}
