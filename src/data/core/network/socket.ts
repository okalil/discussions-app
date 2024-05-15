import { io } from 'socket.io-client';

import { storage } from '../local/storage';
import { url } from './api';

const socket = io(url, {
  autoConnect: false,
  async auth(cb) {
    const token = await storage.getItem('token');
    cb({ token });
  },
});

export { socket };
