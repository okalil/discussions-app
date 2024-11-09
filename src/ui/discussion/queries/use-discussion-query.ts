import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getDiscussionRepository } from '~/data/discussion/discussion.repository';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useDiscussionQuery(discussionId: string) {
  const discussionRepository = getDiscussionRepository();
  return useQuery({
    queryKey: ['discussions', discussionId],
    queryFn: () => discussionRepository.getDiscussion(discussionId),
    enabled: !!discussionId,
    staleTime: 0,
  });
}

export function useWatchDiscussionUpdates(discussionId: string) {
  const queryClient = useQueryClient();
  React.useEffect(() => {
    const discussionRepository = getDiscussionRepository();
    const commentsRepository = getCommentRepository(discussionId);
    const unwatchDiscussion = discussionRepository.watchDiscussionUpdate(
      discussionId,
      () => {
        queryClient.invalidateQueries({
          queryKey: ['discussions', discussionId],
        });
      },
    );
    const unwatchComments = commentsRepository.watchComments((comments) => {
      queryClient.setQueryData(
        ['discussions', discussionId, 'comments'],
        comments,
      );
    });
    return () => {
      unwatchDiscussion();
      unwatchComments();
    };
  }, [discussionId, queryClient]);
}
