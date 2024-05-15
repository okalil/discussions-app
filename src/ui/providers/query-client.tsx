import {
  QueryClient,
  QueryClientProvider as Provider,
} from '@tanstack/react-query';
import { experimental_createPersister } from '@tanstack/query-persist-client-core';

import { storage } from '~/data/core/local/storage';
import { Toast, Toaster } from '../shared/toast';

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

export function QueryClientProvider({ children }: React.PropsWithChildren) {
  return <Provider client={client}>{children}</Provider>;
}
