import { FilterField } from "@/types/core";

export const generateQueryString = (filters: FilterField[]): string => {
    return filters
        .filter(filter => filter.value !== undefined && filter.value !== null)
        .map(filter => `${encodeURIComponent(filter.field)}__${encodeURIComponent(filter.operator)}=${encodeURIComponent(filter.value)}`)
        .join('&');
};
