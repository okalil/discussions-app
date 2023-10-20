import { api } from './network/api';

interface RemoteDiscussion {
  id: string;
  title: string;
  user: { id: number; name: string; picture?: { url: string } };
  user_voted: boolean;
  votes_count: number;
  comments_count: number;
}

export class DiscussionsRepository {
  async getDiscussions({ page }: { page: number }) {
    interface RemoteDiscussions {
      data: RemoteDiscussion[];
      meta: { current_page: number; last_page: number };
    }

    const response = await api.get(`/api/v1/discussions?page=${page}`);
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

  async getDiscussion(id: string) {
    const response = await api.get('/api/v1/discussions/' + id);
    const json: { discussion: RemoteDiscussion } = await response.json();
    return json.discussion;
  }

  async upvoteDiscussion(id: string) {
    await api.post(`/api/v1/discussions/${id}/votes`);
  }

  async downvoteDiscussion(id: string) {
    await api.delete(`/api/v1/discussions/${id}/votes`);
  }
}
