import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentsRepository } from '~/data/comments-repository';

interface VoteCommentProps {
  discussionId: string;
  commentId: string;
}

export function useVoteCommentMutation({
  discussionId, commentId,
}: VoteCommentProps) {
  const client = useQueryClient();
  const mutation = useMutation({
    async mutationFn(voted: boolean) {
      const repository = new CommentsRepository();
      return voted
        ? repository.upvoteComment({ commentId, discussionId })
        : repository.downvoteComment({ commentId, discussionId });
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId],
      });
    },
  });
  return mutation;
}
