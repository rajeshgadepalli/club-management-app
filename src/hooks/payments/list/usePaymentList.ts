import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { usePayment } from '../api/usePayment';
import { FilterField, FilterOperator } from '@/types/core';
import { FilterReturnType } from '@/types/commonFilter';

export function usePaymentList() {
    const navigation = useNavigation();
    const [showFilter, setShowFilter] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [commonFilter, setCommonFilter] = useState<{ [key: string]: any }>({});

    const {
        payments,
        loading,
        error,
        hasMore,
        fetchPayments,
    } = usePayment();

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        // No API call, just filter the existing payments
    }, []);

    const handleFilter = useCallback((filters: any) => {
        const apiFilters: FilterField[] = [];

        if (filters.fromDate && filters.toDate) {
            apiFilters.push({
                field: FilterReturnType.DATE_DROPDOWN_PAYMENT_KEY,
                operator: FilterOperator.GTE,
                value: filters.fromDate,
            });
            apiFilters.push({
                field: FilterReturnType.DATE_DROPDOWN_PAYMENT_KEY,
                operator: FilterOperator.LTE,
                value: filters.toDate,
            });
        }

        setCommonFilter(filters);
        setShowFilter(false);
        fetchPayments(apiFilters);
    }, [fetchPayments]);

    const handleAddPayment = useCallback(() => {
        navigation.navigate('PaymentForm');
    }, [navigation]);

    const handleEditPayment = useCallback((paymentId: number) => {
        navigation.navigate('PaymentForm', { id: paymentId });
    }, [navigation]);

    const handleRefresh = useCallback(() => {
        fetchPayments([]);
    }, [fetchPayments]);

    const handleEndReached = useCallback(() => {
        if (!loading && hasMore && !searchQuery.trim()) {
            fetchPayments([], true);
        }
    }, [loading, hasMore, searchQuery, fetchPayments]);

    const filteredPayments = payments?.filter(payment =>
        !searchQuery.trim() ? true :
            payment.orderNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.dealerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        payments: filteredPayments,
        loading,
        error,
        hasMore,
        searchQuery,
        showFilter,
        showDateDropdown,

        handleSearch,
        handleFilter,
        handleAddPayment,
        handleEditPayment,
        handleRefresh,
        handleEndReached,
        setShowFilter,
        fetchPayments,
    };
}
