import * as Location from 'expo-location';

interface LocationData {
    latitude: number;
    longitude: number;
}

class LocationService {
    private static instance: LocationService;
    private currentLocation: LocationData | null = null;

    private constructor() { }

    static getInstance(): LocationService {
        if (!LocationService.instance) {
            LocationService.instance = new LocationService();
        }
        return LocationService.instance;
    }

    async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    }

    async getCurrentLocation(): Promise<LocationData | null> {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                return null;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });

            this.currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };

            return this.currentLocation;
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    }

    getCachedLocation(): LocationData | null {
        return this.currentLocation;
    }
}

export const locationService = LocationService.getInstance();