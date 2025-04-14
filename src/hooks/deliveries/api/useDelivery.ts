import { useState, useCallback, useEffect } from 'react';
import { deliveryService } from '@/services/api/deliveries/deliveryService';
import { Delivery, DeliveryLite } from '@/types/delivery';
import { FilterField } from '@/types/core';
import { ApiResponse } from '@/services/api/types';

interface UseDeliveryState {
  delivery: Delivery | null;
  deliveries: DeliveryLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function useDelivery(id?: number) {
  const [state, setState] = useState<UseDeliveryState>({
    delivery: null,
    deliveries: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  const [initialDeliveries, setInitialDeliveries] = useState<DeliveryLite[]>([]);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      deliveries: initialDeliveries,
    }));
  }, [initialDeliveries]);

  const fetchDeliveries = useCallback(async (filters: FilterField[] = [], loadMore = false) => {
    try {
      let nextPage = 0;
      setState(prev => {
        nextPage = loadMore ? prev.page + 1 : 0;
        return { ...prev, loading: true, error: null };
      });

      const response = await deliveryService.getDeliveries(filters, nextPage);

      if (response.data.content) {
        if (!loadMore && filters.length === 0) {
          setInitialDeliveries(response.data.content);
        }

        setState(prev => ({
          ...prev,
          deliveries: loadMore ? [...prev.deliveries, ...response.data.content] : response.data.content,
          loading: false,
          page: nextPage,
          hasMore: !response.data.last,
        }));
        return response.data;
      }

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch deliveries',
      }));
      throw error;
    }
  }, []);

  const fetchDelivery = useCallback(async (deliveryKey: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await deliveryService.getByKey(deliveryKey);

      if (response.data) {
        setState(prev => ({
          ...prev,
          delivery: response.data,
          loading: false,
          error: null,
        }));
        return response.data;
      }
      throw new Error('No delivery data received');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch delivery',
      }));
      throw error;
    }
  }, []);

  const confirmDelivery = useCallback(async (deliveryKey: number, data: Partial<Delivery>) => {
    try {
      setState(prev => ({ ...prev, saving: true, error: null }));
      const response: ApiResponse<Delivery> = await deliveryService.confirmDelivery(deliveryKey, data);

      if (response) {
        setState(prev => ({
          ...prev,
          delivery: response.data,
          saving: false,
          success: true,
          message: 'Delivery confirmed successfully',
        }));
        return response.data;
      }

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error.response?.data?.message || 'Failed to confirm delivery',
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    resetState,
    fetchDeliveries,
    fetchDelivery,
    confirmDelivery,
  };
}
