import { io } from 'socket.io-client';

import { url } from './api';
import { storage } from '../local/storage';

const token = storage.getString('token');

const socket = io(url, { autoConnect: !!token, auth: { token } });

export { socket };
