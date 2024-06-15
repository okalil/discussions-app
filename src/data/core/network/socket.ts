import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { storage } from '../local/storage';
import { url } from './api';

declare const globalThis: {
  socket: Socket;
} & typeof global;

function getSocketSingleton() {
  globalThis.socket ??= io(url, { autoConnect: false });
  return globalThis.socket;
}

const socket = getSocketSingleton();

storage.getItem('token').then((token) => {
  if (!token) return;
  socket.auth = { token };
  socket.connect();
});

export { socket };
