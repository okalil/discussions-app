import { api } from './network/api';
import { socket } from './network/socket';
import { Discussion } from './discussion';

export class DiscussionsRepository {
  async getDiscussions({ page }: { page: number }) {
    const response = await api.get(`/api/v1/discussions?page=${page}`);
    const json = await response.json();

    const data = (json.data ?? []).map(Discussion.fromJson);
    const next =
      json.meta?.current_page < json.meta?.last_page
        ? json.meta?.current_page + 1
        : null;
    return {
      data,
      next,
    };
  }

  async getDiscussion(id: string) {
    const response = await api.get('/api/v1/discussions/' + id);
    const json = await response.json();
    return Discussion.fromJson(json.discussion);
  }

  async upvoteDiscussion(id: string) {
    await api.post(`/api/v1/discussions/${id}/votes`);
  }

  async downvoteDiscussion(id: string) {
    await api.delete(`/api/v1/discussions/${id}/votes`);
  }

  async createDiscussion(payload: {
    title: string;
    description: string;
  }): Promise<string> {
    const body = JSON.stringify(payload);
    const response = await api.post(`/api/v1/discussions`, { body });
    const json = await response.json();
    return json?.discussion?.id ?? '';
  }

  async updateDiscussion(id: string, payload: object) {
    const body = JSON.stringify(payload);
    await api.put(`/api/v1/discussions/${id}`, { body });
  }

  sendDiscussionSubscribe(discussionId: string) {
    socket.emit('discussion_subscribe', discussionId);
  }
  sendDiscussionUnsubscribe(discussionId: string) {
    socket.emit('discussion_unsubscribe', discussionId);
  }
  addDiscussionUpdateListener(listener: (id: string) => void) {
    socket.on('discussion_update', listener);
    return function removeDiscussionUpdateListener() {
      socket.off('discussion_update', listener);
    };
  }
}
