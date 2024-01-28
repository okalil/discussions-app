import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DiscussionsRepository } from '~/data/discussions-repository';

interface Props {
  discussionId: string;
}

export function useVoteDiscussionMutation({ discussionId }: Props) {
  const client = useQueryClient();
  return useMutation({
    async mutationFn(voted: boolean) {
      const repository = new DiscussionsRepository();
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
