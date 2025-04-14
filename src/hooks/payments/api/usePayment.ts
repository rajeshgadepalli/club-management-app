import { useState, useCallback } from 'react';
import { paymentService } from '@/services/api/payments/paymentService';
import { Payment, PaymentLite } from '@/types/payment';
import { FilterField } from '@/types/core';

interface UsePaymentState {
  payment: Payment | null;
  payments: PaymentLite[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  page: number;
  hasMore: boolean;
}

export function usePayment(id?: number) {
  const [state, setState] = useState<UsePaymentState>({
    payment: null,
    payments: [],
    loading: false,
    saving: false,
    error: null,
    message: null,
    success: false,
    page: 0,
    hasMore: true,
  });

  const [initialPayments, setInitialPayments] = useState<PaymentLite[]>([]);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      message: null,
      success: false,
      page: 0,
      hasMore: true,
      payments: initialPayments,
    }));
  }, [initialPayments]);

  const createPayment = useCallback(async (data: Partial<Payment>) => {
    try {
      setState(prev => ({ ...prev, saving: true, error: null }));
      const response = await paymentService.create(data);
      setState(prev => ({
        ...prev,
        saving: false,
        success: response.success,
        message: response.message || 'Payment created successfully',
        payment: response.data,
      }));
      return response.data;
    } catch (error: any) {
      console.log(error);
      setState(prev => ({
        ...prev,
        saving: false,
        success: false,
        message: error.response?.data?.message || 'Failed to create payment',
        error: error.response?.data?.message || 'Failed to create payment',
      }));
      throw error;
    }
  }, []);

  const fetchPayment = useCallback(async (paymentId: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await paymentService.getById(paymentId);
      setState(prev => ({
        ...prev,
        payment: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch payment',
      }));
      throw error;
    }
  }, []);

  const fetchPayments = useCallback(async (filters: FilterField[] = [], loadMore: boolean = false) => {
    try {
      let nextPage = 0;
      setState(prev => {
        nextPage = loadMore ? prev.page + 1 : 0;
        return { ...prev, loading: true, error: null };
      });

      const response = await paymentService.getPayments(filters, nextPage);

      if (!loadMore && filters.length === 0) {
        setInitialPayments(response.data.content);
      }

      setState(prev => ({
        ...prev,
        payments: loadMore ? [...prev.payments, ...response.data.content] : response.data.content,
        loading: false,
        page: response.data.pageable.pageNumber,
        hasMore: !response.data.last,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch payments',
      }));
    }
  }, []);

  return {
    ...state,
    createPayment,
    fetchPayment,
    fetchPayments,
    resetState,
  };
}
