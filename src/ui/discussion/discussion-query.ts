import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DiscussionsRepository } from '~/data/discussions-repository';
import { useSocketEvent } from '~/ui/shared/utils';
import { socket } from '~/data/network/socket';

interface Props {
  discussionId: string;
}

export function useDiscussionQuery({ discussionId }: Props) {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn() {
      client.prefetchQuery({
        queryKey: ['discussions', discussionId, 'comments'],
      });
      const repository = new DiscussionsRepository();
      return repository.getDiscussion(discussionId);
    },
    enabled: !!discussionId,
  });

  React.useEffect(() => {
    socket.emit('discussion_subscribe', discussionId);
    return () => {
      socket.emit('discussion_unsubscribe', discussionId);
    };
  }, [discussionId]);

  useSocketEvent('discussion_update', async id => {
    if (id === discussionId) {
      query.refetch();
    }
  });

  return query;
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
