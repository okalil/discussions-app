import React from 'react';
import { useMutationState, useQuery } from '@tanstack/react-query';
import type { CommentDto } from '~/data/comment/comment.dto';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useCommentsQuery(discussionId: string) {
  const commentsRepository = React.useMemo(
    () => getCommentRepository(discussionId),
    [discussionId]
  );
  const [deletedComment] = useMutationState({
    filters: { mutationKey: ['delete_comment', discussionId] },
    select(mutation) {
      return mutation.state.variables as CommentDto;
    },
  });

  const query = useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    queryFn: () => commentsRepository.getComments(),
    select(data) {
      if (deletedComment) {
        return data.filter(it => it.id !== deletedComment.id);
      }
      return data;
    },
  });

  React.useEffect(() => {
    const subscriptions = [
      commentsRepository.listenCommentCreate(() => query.refetch()),
      commentsRepository.listenCommentUpdate(() => query.refetch()),
      commentsRepository.listenCommentDelete(() => query.refetch()),
    ];
    return () => subscriptions.forEach(remove => remove());
  }, []);

  return query;
}
