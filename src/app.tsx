import React from 'react';
import { View } from 'react-native';
import { registerRootComponent } from 'expo';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NavigationStack } from './ui/navigation/stack';

function App() {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <SafeAreaProvider>
        <SafeAreaContainer>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </SafeAreaContainer>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </QueryClientProvider>
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

registerRootComponent(App);
