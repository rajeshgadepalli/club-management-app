import { useState, useCallback } from 'react';
import { productService } from '@/services/api/products/productService';
import { Product } from '@/types/core';
import { FilterField } from '@/types/core';

interface UseProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean;
    page: number;
    hasMore: boolean;
}

export function useProduct() {
    const [state, setState] = useState<UseProductState>({
        products: [],
        loading: false,
        error: null,
        message: null,
        success: false,
        page: 0,
        hasMore: true,
    });

    const [initialProducts, setInitialProducts] = useState<Product[]>([]);

    const resetState = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            message: null,
            success: false,
            page: 0,
            hasMore: true,
            products: initialProducts,
        }));
    }, [initialProducts]);

    const fetchProducts = useCallback(
        async (filters: FilterField[] = [], loadMore: boolean = false) => {
            try {
                let nextPage = 0;
                setState(prev => {
                    nextPage = loadMore ? prev.page + 1 : 0;
                    return { ...prev, loading: true, error: null };
                });

                const response = await productService.getProducts(filters, nextPage);

                if (!loadMore && filters.length === 0) {
                    setInitialProducts(response.data.content);
                }

                setState(prev => ({
                    ...prev,
                    products: loadMore
                        ? [...prev.products, ...response.data.content]
                        : response.data.content,
                    loading: false,
                    page: response.data.pageable.pageNumber,
                    hasMore: !response.data.last,
                }));
            } catch (error: any) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || 'Failed to fetch products',
                }));
            }
        },
        []
    );

    return {
        ...state,
        fetchProducts,
        resetState,
    };
}
