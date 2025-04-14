import { useState, useCallback } from 'react';
import { SalesOrder, SalesOrderLite } from '@/types/salesOrder';
import { FilterField } from '@/types/core';
import { salesOrderService } from '@/services/api/salesOrders/salesOrderService';

interface UseSalesOrderState {
  salesOrder: SalesOrder | null;
  salesOrders: SalesOrderLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function useSalesOrder(id?: number) {
  const [state, setState] = useState<UseSalesOrderState>({
    salesOrder: null,
    salesOrders: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  const [initialOrders, setInitialOrders] = useState<SalesOrderLite[]>([]);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      salesOrders: initialOrders,
    }));
  }, [initialOrders]);

  const createSalesOrder = useCallback(async (data: Partial<SalesOrder>) => {
    try {
      setState(prev => ({ ...prev, saving: true, error: null }));
      const response = await salesOrderService.createSalesOrder(data);
      setState(prev => ({
        ...prev,
        saving: false,
        success: response.success,
        message: response.message || 'Sales order created successfully',
        salesOrder: response.data,
      }));
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        saving: false,
        success: false,
        message: error.response?.data?.message || 'Failed to create sales order',
        error: error.response?.data?.message || 'Failed to create sales order',
      }));
      throw error;
    }
  }, []);

  const fetchSalesOrder = useCallback(async (orderId: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await salesOrderService.getSalesOrderById(orderId);
      setState(prev => ({
        ...prev,
        salesOrder: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch sales order',
      }));
      throw error;
    }
  }, []);

  const fetchSalesOrders = useCallback(async (filters: FilterField[] = [], loadMore = false) => {
    try {
      let nextPage = 0;
      setState(prev => {
        nextPage = loadMore ? prev.page + 1 : 0;
        return { ...prev, loading: true, error: null };
      });

      const response = await salesOrderService.getAllSalesOrders(filters, nextPage);
      if (!loadMore && filters.length === 0) {
        setInitialOrders(response.data.content);
      }

      setState(prev => ({
        ...prev,
        salesOrders: loadMore ? [...prev.salesOrders, ...response.data.content] : response.data.content,
        loading: false,
        page: response.data.pageable.pageNumber,
        hasMore: !response.data.last,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch sales orders',
      }));
    }
  }, []);

  return {
    ...state,
    createSalesOrder,
    fetchSalesOrder,
    fetchSalesOrders,
    resetState,
  };
}
