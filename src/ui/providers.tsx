import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { storage } from '~/data/local/storage';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      persister: experimental_createPersister({ storage }),
    },
    mutations: { retry: 0 },
  },
});

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <BottomSheetModalProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </BottomSheetModalProvider>
    </SafeAreaProvider>
  );
}
