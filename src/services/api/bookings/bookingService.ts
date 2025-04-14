import { Booking } from '@/types/booking';
import { Court } from '@/types/court';
import { Slot } from '@/types/slot';
import { ApiResponse } from '../types';
import { apiClient } from '../client';

const bookingService = {
    async getBookings(): Promise<ApiResponse<Booking[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    },

    async getCourts(): Promise<ApiResponse<Court[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Court[]>>('/courts');
            return response.data;
        } catch (error) {
            console.error('Error fetching courts:', error);
            throw error;
        }
    },

    async getAvailability(courtId: string, date: string): Promise<ApiResponse<Slot[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Slot[]>>(`/bookings/availability?courtId=${courtId}&date=${date}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching availability:', error);
            throw error;
        }
    },

    async createBooking(booking: Partial<Booking>): Promise<ApiResponse<Booking>> {
        try {
            const response = await apiClient.post<ApiResponse<Booking>>('/bookings', booking);
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    async deleteBooking(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await apiClient.delete<ApiResponse<void>>(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    },

    async getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Booking[]>>(`/bookings?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            throw error;
        }
    },
};

export default bookingService;