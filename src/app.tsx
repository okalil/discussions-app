import { registerRootComponent } from 'expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import React from 'react';

import { Navigation } from './navigation';

function App() {
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <Navigation />
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);
