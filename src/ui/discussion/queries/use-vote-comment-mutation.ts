import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommentRepository } from '~/data/comment/comment.repository';

interface VoteCommentProps {
  discussionId: string;
  commentId: string;
}

export function useVoteCommentMutation({
  discussionId,
  commentId,
}: VoteCommentProps) {
  const client = useQueryClient();
  const mutation = useMutation({
    async mutationFn(voted: boolean) {
      const repository = getCommentRepository(discussionId);
      return voted
        ? repository.upvoteComment(commentId)
        : repository.downvoteComment(commentId);
    },
    onSettled: () =>
      client.invalidateQueries({
        queryKey: ['discussions', discussionId],
      }),
  });
  return mutation;
}
