import * as Location from 'expo-location';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<LocationCoordinates | undefined> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission denied');
      return undefined;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return undefined;
  }
};
