import { useState, useCallback } from 'react';
import { Payment } from '@/types/payment';
import { paymentService } from '@/services/api/payments/paymentService';

interface UsePaymentViewState {
    payment: Payment | null;
    isLoading: boolean;
    error: string | null;
}

export const usePaymentView = (paymentId: number) => {
    const [state, setState] = useState<UsePaymentViewState>({
        payment: null,
        isLoading: false,
        error: null
    });

    const fetchPayment = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await paymentService.getById(paymentId);

            setState(prev => ({
                ...prev,
                payment: response.data,
                isLoading: false
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load payment';
            setState(prev => ({
                ...prev,
                error: message,
                isLoading: false
            }));
        }
    }, [paymentId]);

    return {
        ...state,
        fetchPayment
    };
};
