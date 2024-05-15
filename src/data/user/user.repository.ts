import { storage } from '../core/local/storage';
import { api } from '../core/network/api';
import { socket } from '../core/network/socket';

import type { LoginDto } from './login.dto';
import type { RegisterDto } from './register.dto';
import type { UpdateUserDto } from './update-user.dto';
import type { UserDto } from './user.dto';

export function getUserRepository() {
  return new UserRepository();
}

export class UserRepository {
  async getUser(): Promise<UserDto | null> {
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

  async login(payload: LoginDto) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users/login', { body });
    const json = await response.json();
    const token = json.token;
    storage.setItem('token', token);

    socket.auth = { token };
    socket.connect();
  }

  async register(payload: RegisterDto) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users', { body });
    const json = await response.json();
    const token = json.token;
    storage.setItem('token', token);

    socket.auth = { token };
    socket.connect();
  }

  async updateProfile(data: UpdateUserDto) {
    const body = new FormData();
    body.append('name', data.name);
    if (data.picture) body.append('picture', data.picture);

    await api.put('/api/v1/profile', { body });
  }
}
