import React from 'react';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { getDiscussionRepository } from '~/data/discussion/discussion.repository';
import type { DiscussionDto } from '~/data/discussion/discussion.dto';
import { useStream } from '../../shared/utils/use-stream';

const discussionRepository = getDiscussionRepository();

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
      return discussionRepository.getDiscussion(discussionId);
    },
    enabled: !!discussionId,
  });

  React.useEffect(
    () => discussionRepository.joinDiscussionChannel(discussionId),
    [discussionId],
  );
  useStream(discussionRepository.getDiscussionStream(discussionId), (data) =>
    client.setQueryData<DiscussionDto>(['discussions', discussionId], data),
  );

  return query;
}
