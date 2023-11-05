import { io } from 'socket.io-client';

import { url } from './api';
import { storage } from '../local/storage';

const socket = io(url, { autoConnect: false });

storage.getItem('token').then(token => {
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
});

export { socket };
