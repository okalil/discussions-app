import React from 'react';
import { View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
          <SafeAreaContainer>
            <NavigationContainer>
              <NavigationStack onReady={SplashScreen.hideAsync} />
            </NavigationContainer>
          </SafeAreaContainer>
        </SafeAreaProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </QueryProvider>
  );
}

function SafeAreaContainer({ children }: React.PropsWithChildren) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {children}
    </View>
  );
}
