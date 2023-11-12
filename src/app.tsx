import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { NavigationStack } from './ui/navigation/stack';
import { QueryProvider } from './query-provider';

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <NavigationStack onReady={SplashScreen.hideAsync} />
          </NavigationContainer>
        </SafeAreaProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
