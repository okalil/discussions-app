import { api } from './network/api';

export class DiscussionsRepository {
  async getDiscussions({ page }: { page: number }) {
    interface RemoteDiscussions {
      data: { title: string }[];
      meta: { current_page: number; last_page: number };
    }

    const response = await api.get('/api/v1/discussions?page=' + page);
    const json: RemoteDiscussions = await response.json();
    const next =
      json.meta.current_page === json.meta.last_page
        ? null
        : json.meta.current_page + 1;
    return {
      data: json.data,
      next,
    };
  }
}
