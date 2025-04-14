import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAppInitialization } from '@/hooks/useAppInitialization';

export default function App() {
  const { appIsReady, onLayoutRootView } = useAppInitialization();

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <PaperProvider theme={theme} onLayout={onLayoutRootView}>
            <AppNavigator />
          </PaperProvider>
        </AuthProvider>
    </GestureHandlerRootView>
  );
}
