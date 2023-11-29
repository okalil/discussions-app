import React from 'react';
import { socket } from '~/data/network/socket';

export function cn(...args: (string | null | undefined | false)[]) {
  return args.filter(Boolean).join(' ');
}

export function useSocketEvent(event: string, callback: (data: any) => void) {
  React.useEffect(() => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}
