import { api } from './network/api';
import { Comment } from './comment';
import { socket } from './network/socket';

export class CommentsRepository {
  async getComments(dicussionId: string) {
    const response = await api.get(
      `/api/v1/discussions/${dicussionId}/comments`
    );
    const json = await response.json();

    const comments: Comment[] = (json.comments ?? []).map(Comment.fromJson);
    return comments;
  }

  async getComment(params: { discussionId: string; commentId: string }) {
    const response = await api.get(
      `/api/v1/discussions/${params.discussionId}/comments/${params.commentId}`
    );
    const json = await response.json();
    return Comment.fromJson(json.comment);
  }

  async upvoteComment(params: { discussionId: string; commentId: string }) {
    await api.post(
      `/api/v1/discussions/${params.discussionId}/comments/${params.commentId}/votes`
    );
  }

  async downvoteComment(params: { discussionId: string; commentId: string }) {
    await api.delete(
      `/api/v1/discussions/${params.discussionId}/comments/${params.commentId}/votes`
    );
  }

  async createComment(
    params: { discussionId: string },
    payload: { content: string }
  ) {
    const body = JSON.stringify(payload);
    await api.post(`/api/v1/discussions/${params.discussionId}/comments`, {
      body,
    });
  }

  async updateComment(
    params: { discussionId: string; commentId: string },
    payload: { content: string }
  ) {
    const body = JSON.stringify(payload);
    await api.put(
      `/api/v1/discussions/${params.discussionId}/comments/${params.commentId}`,
      { body }
    );
  }

  async deleteComment(params: { discussionId: string; commentId: string }) {
    await api.delete(
      `/api/v1/discussions/${params.discussionId}/comments/${params.commentId}`
    );
  }

  addCommentCreateListener(listener: () => void) {
    socket.on('comment_create', listener);
    return function removeCommentCreateListener() {
      socket.off('comment_create', listener);
    };
  }
  addCommentUpdateListener(listener: () => void) {
    socket.on('comment_update', listener);
    return function removeCommentUpdateListener() {
      socket.off('comment_update', listener);
    };
  }
  addCommentDeleteListener(listener: () => void) {
    socket.on('comment_delete', listener);
    return function removeCommentDeleteListener() {
      socket.off('comment_delete', listener);
    };
  }
}
