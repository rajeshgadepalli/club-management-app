import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDelivery } from '@/hooks/deliveries/api/useDelivery';
import { FilterField, FilterOperator, FilterReturnType } from '@/types/commonFilter';
import { Dealer } from '@/types/dealer';
import { DeliveryLite } from '@/types/delivery';

type NavigationParams = {
  DeliveryScreen: {
    id?: number;
    dealer?: Dealer;
  };
};

export function useDeliveryList(dealer?: Dealer) {
  const navigation = useNavigation<NavigationParams>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(true);
  const [commonFilter, setCommonFilter] = useState<{ [key: string]: any }>({});

  const {
    deliveries,
    loading,
    error,
    hasMore,
    fetchDeliveries,
    resetState,
  } = useDelivery();

  const initialFetch = useCallback(() => {
    const filters: FilterField[] = [];
    if (dealer?.id) {
      filters.push({
        field: 'dealerId',
        operator: FilterOperator.EQ,
        value: dealer.id
      });
    }
    fetchDeliveries(filters);
  }, [dealer, fetchDeliveries]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((filters: any) => {
    const apiFilters: FilterField[] = [];

    if (filters.status) {
      apiFilters.push({
        field: 'deliveryStatus',
        operator: FilterOperator.EQ,
        value: filters.status
      });
    }

    if (filters.fromDate) {
      apiFilters.push({
        field: FilterReturnType.DATE_DROPDOWN_DELIVERY_KEY,
        operator: FilterOperator.GTE,
        value: filters.fromDate
      });
    }

    if (filters.toDate) {
      apiFilters.push({
        field: FilterReturnType.DATE_DROPDOWN_DELIVERY_KEY,
        operator: FilterOperator.LTE,
        value: filters.toDate
      });
    }

    setCommonFilter(filters);
    setShowFilter(false);
    fetchDeliveries(apiFilters);
  }, [fetchDeliveries]);

  const handleAddDelivery = useCallback(() => {
    navigation.navigate('DeliveryScreen', { dealer });
  }, [navigation, dealer]);

  const handleViewDelivery = useCallback((id: number) => {
    navigation.navigate('Delivery', { id });
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    resetState();
    initialFetch();
  }, [resetState, initialFetch]);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore && !searchQuery.trim()) {
      fetchDeliveries(undefined, true); // Load more
    }
  }, [fetchDeliveries, hasMore, loading, searchQuery]);

  // 💡 Local filtering
  const filteredDeliveries = deliveries?.filter(delivery =>
    !searchQuery.trim()
      ? true
      : delivery.deliverTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    deliveries: filteredDeliveries,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    commonFilter,
    handleSearch,
    handleFilter,
    handleAddDelivery,
    handleViewDelivery,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    setShowDateDropdown,
    fetchDeliveries,
  };
}
