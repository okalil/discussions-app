import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDiscussionRepository } from '~/data/discussion/discussion.repository';

export function useVoteDiscussionMutation(discussionId: string) {
  const client = useQueryClient();
  return useMutation({
    async mutationFn(voted: boolean) {
      const repository = getDiscussionRepository();
      return voted
        ? repository.upvoteDiscussion(discussionId)
        : repository.downvoteDiscussion(discussionId);
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId],
      });
    },
  });
}
