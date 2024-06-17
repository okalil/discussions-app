import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDiscussionRepository } from '~/data/discussion/discussion.repository';
import { useStreamQuery } from '../../shared/utils/use-stream-query';

export function useDiscussionQuery(discussionId: string) {
  const discussionRepository = getDiscussionRepository();
  return useQuery({
    queryKey: ['discussions', discussionId],
    queryFn: useStreamQuery((signal) =>
      discussionRepository.getDiscussionStream(discussionId, signal),
    ),
    enabled: !!discussionId,
    staleTime: 0,
  });
}

export function useDiscussionChannel(discussionId: string) {
  const discussionRepository = getDiscussionRepository();
  React.useEffect(
    () => discussionRepository.joinDiscussionChannel(discussionId),
    [discussionId],
  );
}
