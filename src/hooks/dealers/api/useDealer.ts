import { useState, useCallback } from 'react';
import { dealerService } from '@/services/api/dealers/dealerService';
import { Dealer, DealerLite } from '@/types/dealer';
import { FilterField } from '@/types/core';

interface UseDealerState {
  dealer: Dealer | null;
  dealers: DealerLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function useDealer(id?: number) {
  const [state, setState] = useState<UseDealerState>({
    dealer: null,
    dealers: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  // Store initial data separately to avoid unnecessary API calls
  const [initialDealers, setInitialDealers] = useState<DealerLite[]>([]);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      dealers: initialDealers, // Reset to initial data
    }));
  }, [initialDealers]);

  const createDealer = useCallback(async (data: Partial<Dealer>) => {
    try {
      setState(prev => ({ ...prev, saving: true, error: null }));
      const response = await dealerService.create(data);
      setState(prev => ({
        ...prev,
        saving: false,
        success: response.success,
        message: response.message || 'Dealer created successfully',
        dealer: response.data,
      }));
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        saving: false,
        success: false,
        message: error.response?.data?.message || 'Failed to create dealer',
        error: error.response?.data?.message || 'Failed to create dealer',
      }));
      throw error;
    }
  }, []);

  const updateDealer = useCallback(async (data: Partial<Dealer> & { id: number }) => {
    try {
      setState(prev => ({ ...prev, saving: true, error: null }));
      const response = await dealerService.update(data.id, data);
      setState(prev => ({
        ...prev,
        saving: false,
        success: response.success,
        message: response.message || 'Dealer updated successfully',
        dealer: response.data,
      }));
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        saving: false,
        success: false,
        message: error.response?.data?.message || 'Failed to update dealer',
        error: error.response?.data?.message || 'Failed to update dealer',
      }));
      throw error;
    }
  }, []);

  const fetchDealer = useCallback(async (dealerId: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await dealerService.getById(dealerId);
      setState(prev => ({
        ...prev,
        dealer: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch dealer',
      }));
      throw error;
    }
  }, []);

  const fetchDealers = useCallback(async (filters: FilterField[] = [], loadMore: boolean = false) => {
    try {
      let nextPage = 0;
      setState(prev => {
        nextPage = loadMore ? prev.page + 1 : 0;
        return { ...prev, loading: true, error: null };
      });

      const response = await dealerService.getDealers(filters, nextPage);

      // If this is initial load or filter change, save as initial data
      if (!loadMore && filters.length === 0) {
        setInitialDealers(response.data.content);
      }

      setState(prev => ({
        ...prev,
        dealers: loadMore ? [...prev.dealers, ...response.data.content] : response.data.content,
        loading: false,
        page: response.data.pageable.pageNumber,
        hasMore: !response.data.last,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch dealers',
      }));
    }
  }, []);

  return {
    ...state,
    createDealer,
    updateDealer,
    fetchDealer,
    fetchDealers,
    resetState,
  };
}
