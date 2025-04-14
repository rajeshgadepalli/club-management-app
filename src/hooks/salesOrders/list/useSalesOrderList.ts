import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSalesOrder } from '../api/useSalesOrder';
import { FilterField, FilterOperator } from '@/types/core';
import { FilterReturnType } from '@/types/commonFilter';
import { Dealer } from '@/types/dealer';

export function useSalesOrderList(dealer?: Dealer) {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const [showFilter, setShowFilter] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [commonFilter, setCommonFilter] = useState<{ [key: string]: any }>({});

    const {
        salesOrders,
        loading,
        error,
        hasMore,
        fetchSalesOrders,
        resetState
    } = useSalesOrder();

    const initialFilters: FilterField[] = useMemo(
        () => route?.params?.filters || [],
        [route?.params?.filters]
      );

    const initialFetch = useCallback(() => {
        const filters: FilterField[] = [...initialFilters];

        if (dealer) {
            filters.push({
                field: 'dealer.id',
                operator: FilterOperator.EQ,
                value: dealer.id,
            });
        }

        fetchSalesOrders(filters);
    }, [dealer, fetchSalesOrders, initialFilters]);

    useEffect(() => {
        initialFetch();
    }, [initialFetch]);

    // Handle search query
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        // No API call needed — search filters local list
    }, []);

    // Handle filter submission
    const handleFilter = useCallback((filters: any) => {
        const apiFilters: FilterField[] = [];

        // Filter by dealer if provided
        if (dealer) {
            apiFilters.push({
                field: 'dealer.id',
                operator: FilterOperator.EQ,
                value: dealer.id,
            });
        }

        // Filter by date range
        if (filters.fromDate && filters.toDate) {
            apiFilters.push({
                field: FilterReturnType.DATE_DROPDOWN_SALES_ORDER_KEY,
                operator: FilterOperator.GTE,
                value: filters.fromDate,
            });
            apiFilters.push({
                field: FilterReturnType.DATE_DROPDOWN_SALES_ORDER_KEY,
                operator: FilterOperator.LTE,
                value: filters.toDate,
            });
        }

        setCommonFilter(filters);
        setShowFilter(false);
        fetchSalesOrders(apiFilters);
    }, [fetchSalesOrders, dealer]);

    // Add sales order for a dealer
    const handleAddOrder = useCallback(() => {
        navigation.navigate('SalesOrderForm', {
            dealer,
        });
    }, [navigation, dealer]);

    // Edit existing sales order
    const handleEditOrder = useCallback((salesOrderId: number) => {
        navigation.navigate('SalesOrderForm', {
            dealer,
            id: salesOrderId,
        });
    }, [navigation, dealer]);

    // View sales order details
    const handleViewOrder = useCallback((salesOrderId: number) => {
        navigation.navigate('ViewSalesOrder', {
            id: salesOrderId,
        });
    }, [navigation]);

    // Refresh the list
    const handleRefresh = useCallback(() => {
        const filters: FilterField[] = [];
        if (dealer) {
            filters.push({
                field: 'dealer.id',
                operator: FilterOperator.EQ,
                value: dealer.id,
            });
        }
        fetchSalesOrders(filters);
    }, [fetchSalesOrders, dealer]);

    // Pagination
    const handleEndReached = useCallback(() => {
        if (!loading && hasMore && !searchQuery.trim()) {
            const filters: FilterField[] = [];
            if (dealer) {
                filters.push({
                    field: 'dealer.id',
                    operator: FilterOperator.EQ,
                    value: dealer.id,
                });
            }
            fetchSalesOrders(filters, true); // Load more
        }
    }, [loading, hasMore, searchQuery, fetchSalesOrders, dealer]);

    // Filter local sales orders by search string
    const filteredSalesOrders = salesOrders?.filter(order =>
        !searchQuery.trim()
            ? true
            : order.orderNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.dealerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.firmName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const clearError = useCallback(() => {
        resetState();
      }, [resetState]);
    
    return {
        salesOrders: filteredSalesOrders,
        loading,
        error,
        hasMore,
        searchQuery,
        showFilter,
        showDateDropdown,

        // Actions
        handleSearch,
        handleFilter,
        handleAddOrder,
        handleEditOrder,
        handleViewOrder,
        handleRefresh,
        handleEndReached,
        setShowFilter,
        fetchSalesOrders,
        clearError
    };
}
