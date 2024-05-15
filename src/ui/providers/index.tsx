import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Toaster } from '../shared/toast';
import { QueryClientProvider } from './query-client';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <BottomSheetModalProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </BottomSheetModalProvider>
      <Toaster />
    </SafeAreaProvider>
  );
}
