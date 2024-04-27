import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useUpsertCommentMutation(discussionId: string) {
  const client = useQueryClient();
  return useMutation({
    async mutationFn({ id, content }: { id?: string; content: string }) {
      const commentsRepository = getCommentRepository(discussionId);
      if (id) {
        await commentsRepository.updateComment(id, { content });
      } else {
        await commentsRepository.createComment({ content });
      }
      client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
  });
}
