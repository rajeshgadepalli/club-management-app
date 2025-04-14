import { useState, useCallback } from 'react';
import { geolocationService } from '@/services/api/geolocation/geolocationService';
import { GeoLocation } from '@/types/geolocation';
import * as Location from 'expo-location';

interface UseGeolocationState {
  address: GeoLocation | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<UseGeolocationState>({
    address: null,
    loading: false,
  });

  const getAddressFromLocation = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState(prev => ({
          ...prev,
          address: response.data,
          loading: false
        }));
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates
      const response = await geolocationService.getAddressFromCoords(`${latitude},${longitude}`);
      setState(prev => ({
        ...prev,
        address: response.data,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, []);

  return {
    ...state,
    getAddressFromLocation,
  };
}
