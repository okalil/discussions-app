import { storage } from './local/storage';
import { api } from './network/api';
import { socket } from './network/socket';
import { User } from './user';

export class UserRepository {
  async getUser(): Promise<User | null> {
    const token = await storage.getItem('token');
    if (!token) return null;

    const response = await api.get('/api/v1/profile');
    const json = await response.json();
    const user = json.user;
    return user;
  }

  logout() {
    storage.removeItem('token');
  }

  async login(payload: object) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users/login', { body });
    const json = await response.json();
    const token = json.token;
    storage.setItem('token', token);

    socket.auth = { token };
    socket.connect();
  }

  async register(payload: object) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users', { body });
    const json = await response.json();
    const token = json.token;
    storage.setItem('token', token);

    socket.auth = { token };
    socket.connect();
  }

  async updateProfile(data: { name: string; picture: string }) {
    const body = new FormData();
    body.append('name', data.name);
    if (isLocalFile(data.picture))
      body.append('picture', parseFile(data.picture));

    await api.put('/api/v1/profile', { body });

    function parseFile(uri: string): any {
      const [name] = uri.split('/').reverse();
      return { uri, name, type: 'image/jpeg' };
    }
    function isLocalFile(uri: string) {
      return uri && !uri.startsWith('/');
    }
  }
}
