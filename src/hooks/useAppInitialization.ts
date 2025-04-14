import { useState, useCallback, useEffect } from 'react';
// import * as SplashScreen from 'expo-splash-screen';
import { useLoadFonts } from './useLoadFonts';
import { usePinCodeSync } from './geolocation/usePinCodeSync';

export const useAppInitialization = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const loadFonts = useLoadFonts();
    // const { syncPinCodes } = usePinCodeSync();

    useEffect(() => {
        async function prepare() {
            try {
                // Prevent splash screen from auto-hiding
                // await SplashScreen.preventAutoHideAsync();

                // Load fonts
                await loadFonts();

                // Initial sync of pin codes
                // await syncPinCodes();
            } catch (e) {
                console.warn('Error loading app resources:', e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
        // }, [loadFonts, syncPinCodes]);
    }, [loadFonts]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    return {
        appIsReady,
        onLayoutRootView
    };
};