import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { Providers } from './ui/providers';
import { Navigation } from './ui/navigation/stack';

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <Navigation onReady={SplashScreen.hideAsync} />
      </Providers>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
