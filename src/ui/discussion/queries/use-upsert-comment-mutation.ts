import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentsRepository } from '~/data/comments-repository';

export function useUpsertCommentMutation({
  discussionId,
}: {
  discussionId: string;
}) {
  const client = useQueryClient();
  return useMutation({
    async mutationFn({ id, content }: { id?: string; content: string }) {
      const commentsRepository = new CommentsRepository();
      if (id) {
        await commentsRepository.updateComment(
          { discussionId, commentId: id },
          { content }
        );
      } else {
        await commentsRepository.createComment({ discussionId }, { content });
      }
      client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
  });
}
