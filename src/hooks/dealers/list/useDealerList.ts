import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDealer } from '../api/useDealer';
import { FilterField, FilterOperator } from '@/types/core';
import { FilterReturnType } from '@/types/commonFilter';

export function useDealerList() {
  const navigation = useNavigation();
  const [showFilter, setShowFilter] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [commonFilter, setCommonFilter] = useState<{ [key: string]: any }>({});

  const {
    dealers,
    loading,
    error,
    hasMore,
    fetchDealers,
  } = useDealer();

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // No API call, just filter the existing dealers
  }, []);

  // Filter handler
  const handleFilter = useCallback((filters: any) => {
    const apiFilters: FilterField[] = [];
    
    // Convert date filter to API format
    if (filters.fromDate && filters.toDate) {
      apiFilters.push({
        field: FilterReturnType.DATE_DROPDOWN_DEALER_KEY,
        operator: FilterOperator.GTE,
        value: filters.fromDate
      });
      apiFilters.push({
        field: FilterReturnType.DATE_DROPDOWN_DEALER_KEY,
        operator: FilterOperator.LTE,
        value: filters.toDate
      });
    }

    setCommonFilter(filters);
    setShowFilter(false);
    fetchDealers(apiFilters);
  }, [fetchDealers]);

  // Navigation handlers
  const handleAddDealer = useCallback(() => {
    navigation.navigate('AadhaarVerification');
  }, [navigation]);

  const handleEditDealer = useCallback((dealerId: number) => {
    navigation.navigate('DealerForm', { id: dealerId });
  }, [navigation]);

  // List handlers
  const handleRefresh = useCallback(() => {
    fetchDealers([]);
  }, [fetchDealers]);

  const handleEndReached = useCallback(() => {
    // Don't load more if we're searching
    if (!loading && hasMore && !searchQuery.trim()) {
      fetchDealers([], true); // Load more with current filters
    }
  }, [loading, hasMore, searchQuery, fetchDealers]);

  // Filter dealers based on search
  const filteredDealers = dealers?.filter(dealer =>
    !searchQuery.trim() ? true :
    dealer.dealerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer.firmName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer.dealerMobileNo.includes(searchQuery) ||
    dealer.gstinNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    // List state
    dealers: filteredDealers,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,

    // List actions
    handleSearch,
    handleFilter,
    handleAddDealer,
    handleEditDealer,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    fetchDealers,
  };
}
