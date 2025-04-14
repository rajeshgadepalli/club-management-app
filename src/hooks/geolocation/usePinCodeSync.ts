import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { locationStorage } from '@/services/storage/locationStorage';
import { geolocationService } from '@/services/api/geolocation/geolocationService';
import { locationService } from '@/services/location/locationService';
import { PinCodeDirectory } from '@/types/geolocation';

interface UsePinCodeSyncState {
    isLoading: boolean;
    lastSyncDate: string | null;
    pinCodes: PinCodeDirectory[] | null;
    error: string | null;
}

export const usePinCodeSync = () => {
    const [state, setState] = useState<UsePinCodeSyncState>({
        isLoading: false,
        lastSyncDate: null,
        pinCodes: null,
        error: null
    });

    const syncPinCodes = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Check and request location permission
            const hasPermission = await locationService.requestPermissions();
            if (!hasPermission) {
                throw new Error('Location permission not granted');
            }

            // Get current position
            const location = await locationService.getCurrentLocation();
            if (!location) {
                throw new Error('Could not get current location');
            }

            // Get pin codes for location
            const response = await geolocationService.findByCoordinates(
                location.latitude.toString(),
                location.longitude.toString()
            );

            // Store pin codes and sync date
            const today = new Date().toISOString().split('T')[0];
            await locationStorage.setPinCodeData(response.data);
            await locationStorage.setLastSyncDate(today);

            setState(prev => ({
                ...prev,
                lastSyncDate: today,
                pinCodes: response.data,
                isLoading: false,
                error: null
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error syncing pin codes';
            console.error('Error syncing pin codes:', error);
            setState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: errorMessage
            }));
        }
    };

    const checkAndSync = async () => {
        try {
            const lastSync = await locationStorage.getLastSyncDate();
            const today = new Date().toISOString().split('T')[0];

            if (lastSync !== today) {
                // Clear old data and sync new
                await locationStorage.clearPinCodeData();
                await syncPinCodes();
            } else {
                // Load existing data
                const data = await locationStorage.getPinCodeData();
                setState(prev => ({
                    ...prev,
                    lastSyncDate: lastSync,
                    pinCodes: data
                }));
            }
        } catch (error) {
            console.error('Error checking sync status:', error);
        }
    };

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                checkAndSync();
            }
        });

        // Initial check
        checkAndSync();

        return () => {
            subscription.remove();
        };
    }, []);

    return {
        ...state,
        syncPinCodes
    };
};
