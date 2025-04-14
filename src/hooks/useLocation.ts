import { useState, useEffect } from 'react';
import { locationService } from '@/services/location/locationService';

export const useLocation = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initializeLocation();
    }, []);

    const initializeLocation = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const granted = await locationService.requestPermissions();
            setHasPermission(granted);

            if (granted) {
                await locationService.getCurrentLocation();
            }
        } catch (err) {
            setError('Failed to initialize location services');
            console.error('Location initialization error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        hasPermission,
        isLoading,
        error,
        requestPermission: initializeLocation
    };
};