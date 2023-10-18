import { api } from './network/api';

export class UserRepository {
  async login(payload: object) {
    const body = JSON.stringify(payload);
    const response = await api.post('/api/v1/users/login', { body });
    const json = await response.json();
    const token = json.token;
    const user = (
      await (
        await api.get('/api/v1/profile', {
          headers: { Authorization: 'Bearer ' + token },
        })
      ).json()
    ).user;
    return user;
  }
}
