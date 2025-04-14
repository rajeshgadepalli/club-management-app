import { apiClient } from '../client';
import { PaginatedApiResponse, PaginatedContent } from '../types';
import { Product } from '@/types/core';
import { FilterField } from '@/types/core';
import { DEFAULT_PAGE_SIZE } from '@/config';
import { generateQueryString } from '@/utils/queryUtils';

export const productService = {
    /**
     * Get all products with pagination and filtering
     * @param filters Optional filter criteria
     * @param page Page number (0-based)
     * @param size Page size
     * @returns Promise with paginated list of products
     */
    getProducts: async (
        filters: FilterField[] = [],
        page: number = 0,
        size: number = DEFAULT_PAGE_SIZE
    ): Promise<PaginatedApiResponse<Product>> => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            const queryString = generateQueryString(filters);

            const response = await apiClient.get<PaginatedApiResponse<Product>>(
                `/products?${queryString}`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
