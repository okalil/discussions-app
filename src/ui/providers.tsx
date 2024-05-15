import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { storage } from '~/data/core/local/storage';
import { Toast, Toaster } from './shared/toast';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      persister: experimental_createPersister({ storage }),
      retry: 1,
    },
    mutations: {
      onError(error) {
        Toast.show(error.message, Toast.LONG);
      },
    },
  },
});

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <BottomSheetModalProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </BottomSheetModalProvider>
      <Toaster />
    </SafeAreaProvider>
  );
}
