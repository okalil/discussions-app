import { storage } from '../core/local/storage';

import type { LoginDto } from './login.dto';
import type { RegisterDto } from './register.dto';
import type { UpdateUserDto } from './update-user.dto';
import type { UserDto } from './user.dto';
import type * as original from './user.repository';

export function getUserRepository() {
  return new UserRepository();
}

export class UserRepository implements original.UserRepository {
  async getUser(): Promise<UserDto | null> {
    const token = await storage.getItem('token');
    if (!token) return null;

    await delay(300);
    const user = users.find((it) => it.token === token);
    if (!user) throw new Error();
    return user;
  }

  logout() {
    storage.removeItem('token');
  }

  async login(dto: LoginDto) {
    await delay(500);
    const user = users.find(
      (it) => it.email === dto.email && it.password === dto.password,
    );
    if (!user) throw new Error('E-mail ou senha inválidos');
    const token = user.token;
    storage.setItem('token', token);
  }

  async register(dto: RegisterDto) {
    const user = {
      id: Math.random().toString(36),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      token: Math.random().toString(36),
    };
    users.push(user);

    const token = user.token;
    storage.setItem('token', token);
  }

  async updateProfile(data: UpdateUserDto) {
    const token = await storage.getItem('token');
    const user = users.find((it) => it.token === token);
    if (!user) throw new Error();
    user.name = data.name;
    if (data.picture) user.picture = { url: data.picture.uri };
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface FakeUser extends UserDto {
  email: string;
  password: string;
  token: string;
}
const users: FakeUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@mail.com',
    password: 'password',
    token: 'sample_token',
  },
];
