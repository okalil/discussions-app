import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { storage } from '../../data/local/storage';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      persister: experimental_createPersister({ storage }),
    },
    mutations: { retry: 0 },
  },
});

export function QueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
