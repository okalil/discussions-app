import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DiscussionsRepository } from '~/data/discussions-repository';

interface Props {
  discussionId: string;
}

const discussionsRepository = new DiscussionsRepository();

export function useDiscussionQuery({ discussionId }: Props) {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn() {
      client.prefetchQuery({
        queryKey: ['discussions', discussionId, 'comments'],
      });
      return discussionsRepository.getDiscussion(discussionId);
    },
    enabled: !!discussionId,
  });

  React.useEffect(() => {
    discussionsRepository.sendDiscussionSubscribe(discussionId);
    return () => discussionsRepository.sendDiscussionUnsubscribe(discussionId);
  }, [discussionId]);
  React.useEffect(() => {
    return discussionsRepository.addDiscussionUpdateListener(id => {
      if (id === discussionId) {
        query.refetch();
      }
    });
  }, []);

  return query;
}
