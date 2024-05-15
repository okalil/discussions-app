import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Navigation } from './ui/navigation/stack';
import { Providers } from './ui/providers';

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
