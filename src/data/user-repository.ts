import { storage } from './local/storage';
import { api } from './network/api';
import { socket } from './network/socket';

interface User {
  name: string;
}

export class UserRepository {
  getUser(): User | null {
    const userString = storage.getString('user');
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  }

  async login(payload: object) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users/login', { body });
    const json = await response.json();
    const token = json.token;
    storage.set('token', token);

    socket.auth = { token };
    socket.connect();

    const user = await this.getRemoteUser();
    storage.set('user', JSON.stringify(user));
    return user;
  }

  async register(payload: object) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users', { body });
    const json = await response.json();
    const token = json.token;
    storage.set('token', token);

    socket.auth = { token };
    socket.connect();

    const user = await this.getRemoteUser();
    storage.set('user', JSON.stringify(user));
    return user;
  }

  async getRemoteUser() {
    const response = await api.get('/api/v1/profile');
    const json = await response.json();
    const user = json.user;
    return user;
  }
}
