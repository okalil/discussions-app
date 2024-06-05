import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useCommentsQuery(discussionId: string) {
  const commentsRepository = React.useMemo(
    () => getCommentRepository(discussionId),
    [discussionId]
  );
  const query = useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    queryFn: () => commentsRepository.getComments(),
  });

  React.useEffect(() => {
    const subscriptions = [
      commentsRepository.listenCommentCreate(() => query.refetch()),
      commentsRepository.listenCommentUpdate(() => query.refetch()),
      commentsRepository.listenCommentDelete(() => query.refetch()),
    ];
    return () => subscriptions.forEach(remove => remove());
  }, [commentsRepository]);

  return query;
}
