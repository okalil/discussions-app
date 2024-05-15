import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CommentDto } from '~/data/comment/comment.dto';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useDeleteCommentMutation(discussionId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ['delete_comment', discussionId],
    mutationFn: (comment: CommentDto) =>
      getCommentRepository(discussionId).deleteComment(comment.id),
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
  });
}
