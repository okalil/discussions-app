import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import {
  QueryClient,
  QueryClientProvider as Provider,
} from '@tanstack/react-query';

import { storage } from '~/data/core/local/storage';
import { Toast } from '../shared/toast';

const persistor = experimental_createQueryPersister({ storage });

const client = new QueryClient({
  defaultOptions: {
    queries: {
      persister: persistor.persisterFn,
      retry: false,
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
