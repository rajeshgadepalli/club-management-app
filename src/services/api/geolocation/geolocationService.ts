import { GeoLocation, PinCodeDirectory } from '@/types/geolocation';
import { apiClient } from '../client';
import { ApiResponse } from '../types';

export const geolocationService = {
  /**
   * Get address details using Google Maps from latitude/longitude
   * @param latlng Latitude and longitude string in format "lat,lng"
   * @returns Promise with address details
   */
  getAddressFromCoords: async (latlng: string): Promise<ApiResponse<GeoLocation>> => {
    try {
      const response = await apiClient.get<ApiResponse<GeoLocation>>(`/geo-locations/address?latlng=${latlng}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find pin codes by latitude and longitude coordinates
   * @param lat Latitude
   * @param lng Longitude
   * @returns Promise with list of pin codes and their details
   */
  findByCoordinates: async (lat: string, lng: string): Promise<ApiResponse<PinCodeDirectory[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<PinCodeDirectory[]>>(`/geo-locations/locations?lat=${lat}&lng=${lng}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
