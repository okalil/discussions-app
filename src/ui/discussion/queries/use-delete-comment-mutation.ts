import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment } from '~/data/comment';
import { CommentsRepository } from '~/data/comments-repository';

interface Props {
  discussionId: string;
}

export function useDeleteCommentMutation({ discussionId }: Props) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ['delete_comment', discussionId],
    async mutationFn(comment: Comment) {
      const commentsRepository = new CommentsRepository();
      await commentsRepository.deleteComment({
        discussionId,
        commentId: comment.id,
      });
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
  });
}
