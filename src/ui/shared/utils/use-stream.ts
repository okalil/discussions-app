import React from 'react';

export function useStream<T>(
  stream: AsyncGenerator<T>,
  callback: (value: T) => void,
) {
  React.useEffect(() => {
    let aborted = false;
    async function startConsumingStream() {
      for await (let value of stream) {
        if (aborted) break;
        callback(value);
      }
    }
    startConsumingStream();
    return () => {
      aborted = true;
    };
  }, [stream, callback]);
}
