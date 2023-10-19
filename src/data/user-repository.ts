import { storage } from './local/storage';
import { api } from './network/api';

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
    const user = await this.getRemoteUser();
    storage.set('token', token);
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
