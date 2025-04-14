import { useState, useCallback } from 'react';
import { SalesOrder } from '@/types/salesOrder';
import { salesOrderService } from '@/services/api/salesOrders/salesOrderService';

interface UseSalesOrderViewState {
    salesOrder: SalesOrder | null;
    isLoading: boolean;
    error: string | null;
}

export const useSalesOrderView = (orderId: number) => {
    const [state, setState] = useState<UseSalesOrderViewState>({
        salesOrder: null,
        isLoading: false,
        error: null
    });

    const fetchSalesOrder = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await salesOrderService.getSalesOrderById(orderId);

            setState(prev => ({
                ...prev,
                salesOrder: response.data,
                isLoading: false
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load sales order';
            setState(prev => ({
                ...prev,
                error: message,
                isLoading: false
            }));
        }
    }, [orderId]);

    return {
        ...state,
        fetchSalesOrder
    };
};
