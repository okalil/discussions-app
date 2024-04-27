import React from 'react';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { getDiscussionRepository } from '~/data/discussion/discussion.repository';

const discussionsRepository = getDiscussionRepository();

const getCommentsQuery = (discussionId: string) =>
  queryOptions({ queryKey: ['discussions', discussionId, 'comments'] });

export function useDiscussionQuery(discussionId: string) {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn() {
      const commentsQuery = getCommentsQuery(discussionId);
      if (!client.getQueryData(commentsQuery.queryKey)) {
        client.prefetchQuery(commentsQuery);
      }
      return discussionsRepository.getDiscussion(discussionId);
    },
    enabled: !!discussionId,
  });

  React.useEffect(() => {
    discussionsRepository.sendDiscussionSubscribe(discussionId);
    return () => discussionsRepository.sendDiscussionUnsubscribe(discussionId);
  }, [discussionId]);
  React.useEffect(() => {
    return discussionsRepository.listenDiscussionUpdate(id => {
      if (id === discussionId) {
        query.refetch();
      }
    });
  }, []);

  return query;
}
