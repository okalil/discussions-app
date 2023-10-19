import { registerRootComponent } from 'expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import React from 'react';

import { NavigationStack } from './ui/navigation/stack';

function App() {
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <NavigationContainer>
          <NavigationStack />
        </NavigationContainer>
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);
