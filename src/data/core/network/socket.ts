import { io } from 'socket.io-client';

import { url } from './api';
import { storage } from '../local/storage';

const socket = io(url, {
  autoConnect: false,
  async auth(cb) {
    const token = await storage.getItem('token');
    cb({ token });
  },
});

export { socket };
