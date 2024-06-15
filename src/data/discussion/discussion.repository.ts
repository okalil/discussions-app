import { api } from '../core/network/api';
import { socket } from '../core/network/socket';
import { type CreateDiscussionDto } from './create-discussion.dto';
import { type DiscussionDto, DiscussionSchema } from './discussion.dto';
import { type UpdateDiscussionDto } from './update-discussion.dto';

export function getDiscussionRepository() {
  return new DiscussionRepository();
}

export class DiscussionRepository {
  async getDiscussions({ page }: { page: number }) {
    const response = await api.get(`/api/v1/discussions?page=${page}`);
    const json: PaginatedDiscussionsResponse = await response.json();
    const jsonData = json.data ?? [];

    const data = jsonData.map(DiscussionSchema.parse);
    const currentPage = json.meta?.current_page ?? 1;
    const lastPage = json.meta?.last_page ?? 1;
    const next = currentPage < lastPage ? currentPage + 1 : null;
    return { data, next };

    interface PaginatedDiscussionsResponse {
      data: any[];
      meta?: { current_page: number; last_page: number };
    }
  }

  async getDiscussion(id: string): Promise<DiscussionDto> {
    const response = await api.get(`/api/v1/discussions/${id}`);
    const json = await response.json();
    return DiscussionSchema.parse(json.discussion);
  }

  async upvoteDiscussion(id: string) {
    await api.post(`/api/v1/discussions/${id}/votes`);
  }

  async downvoteDiscussion(id: string) {
    await api.delete(`/api/v1/discussions/${id}/votes`);
  }

  async createDiscussion(dto: CreateDiscussionDto): Promise<string> {
    const body = JSON.stringify(dto);
    const response = await api.post(`/api/v1/discussions`, { body });
    const json = await response.json();
    return json?.discussion?.id ?? '';
  }

  async updateDiscussion(id: string, dto: UpdateDiscussionDto) {
    const body = JSON.stringify(dto);
    await api.put(`/api/v1/discussions/${id}`, { body });
  }

  async *getDiscussionStream(): AsyncGenerator<string> {
    while (true) {
      yield await new Promise<any>((resolve) => {
        socket.once('discussion_update', resolve);
      });
    }
  }

  joinDiscussionChannel(discussionId: string) {
    socket.emit('discussion_subscribe', discussionId);
    return function leave() {
      socket.emit('discussion_unsubscribe', discussionId);
    };
  }
}
