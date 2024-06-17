import React from 'react';
import type { QueryFunction } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export function useStreamQuery<T>(
  createStream: (signal: AbortSignal) => AsyncGenerator<T, never>,
): QueryFunction<T> {
  const client = useQueryClient();
  const abortControllerRef = React.useRef<AbortController>();
  return async (context) => {
    const controller = new AbortController();
    abortControllerRef.current?.abort();
    abortControllerRef.current = controller;

    const stream = createStream(controller.signal);
    const { value: initialValue } = await stream.next();

    startConsumingStream();

    // auto abort stream on remove all observers
    const unsubscribe = client.getQueryCache().subscribe((e) => {
      if (e.type === 'observerRemoved' && e.query.getObserversCount() === 0) {
        controller.abort();
        unsubscribe();
      }
    });

    return initialValue;

    async function startConsumingStream() {
      try {
        for await (const value of stream) {
          client.setQueryData(context.queryKey, value);
        }
      } catch {
        // just ignore abort errors
      }
    }
  };
}
