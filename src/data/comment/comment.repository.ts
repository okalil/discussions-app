import { api } from '../core/network/api';
import { socket } from '../core/network/socket';
import type { CommentDto } from './comment.dto';
import { CommentSchema } from './comment.dto';
import type { SaveCommentDto } from './save-comment.dto';

export function getCommentRepository(discussionId: string) {
  return new CommentRepository(discussionId);
}

export class CommentRepository {
  private discussionId: string;
  constructor(discussionId: string) {
    this.discussionId = discussionId;
  }

  async getComments(): Promise<CommentDto[]> {
    const response = await api.get(
      `/api/v1/discussions/${this.discussionId}/comments`
    );
    const json: CommentsResponse = await response.json();

    const comments = json.comments.map(CommentSchema.parse);
    return comments;

    interface CommentsResponse {
      comments: unknown[];
    }
  }

  async getComment(commentId: string): Promise<CommentDto> {
    const response = await api.get(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}`
    );
    const json = await response.json();
    return CommentSchema.parse(json.comment);
  }

  async upvoteComment(commentId: string) {
    await api.post(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}/votes`
    );
  }

  async downvoteComment(commentId: string) {
    await api.delete(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}/votes`
    );
  }

  async createComment(dto: SaveCommentDto) {
    const body = JSON.stringify(dto);
    await api.post(`/api/v1/discussions/${this.discussionId}/comments`, {
      body,
    });
  }

  async updateComment(commentId: string, dto: SaveCommentDto) {
    const body = JSON.stringify(dto);
    await api.put(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}`,
      { body }
    );
  }

  async deleteComment(commentId: string) {
    await api.delete(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}`
    );
  }

  listenCommentCreate(listener: () => void) {
    socket.on('comment_create', listener);
    return function removeCommentCreateListener() {
      socket.off('comment_create', listener);
    };
  }
  listenCommentUpdate(listener: () => void) {
    socket.on('comment_update', listener);
    return function removeCommentUpdateListener() {
      socket.off('comment_update', listener);
    };
  }
  listenCommentDelete(listener: () => void) {
    socket.on('comment_delete', listener);
    return function removeCommentDeleteListener() {
      socket.off('comment_delete', listener);
    };
  }
}
