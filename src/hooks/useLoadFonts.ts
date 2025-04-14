import { useCallback } from 'react';
import * as Font from 'expo-font';

export const useLoadFonts = () => {
  const loadFonts = useCallback(async () => {
    try {
      await Font.loadAsync({
        'Lato-Regular': require('@/assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('@/assets/fonts/Lato-Bold.ttf'),
        'Lato-Black': require('@/assets/fonts/Lato-Black.ttf'),
        'Lato-Light': require('@/assets/fonts/Lato-Light.ttf'),
      });
      return true;
    } catch (error) {
      console.error('Error loading fonts:', error);
      return false;
    }
  }, []);

  return loadFonts;
};