import { useMutationState, useQuery } from '@tanstack/react-query';
import React from 'react';
import { Comment } from '~/data/comment';
import { CommentsRepository } from '~/data/comments-repository';

interface Props {
  discussionId: string;
}

const commentsRepository = new CommentsRepository();

export function useCommentsQuery({ discussionId }: Props) {
  const [deletedComment] = useMutationState({
    filters: { mutationKey: ['delete_comment', discussionId] },
    select(mutation) {
      return mutation.state.variables as Comment;
    },
  });

  const query = useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    async queryFn() {
      return commentsRepository.getComments(discussionId);
    },
    select(data) {
      if (deletedComment) {
        return data.filter(it => it.id !== deletedComment.id);
      }
      return data;
    },
  });

  React.useEffect(() => {
    const unsubscribes = [
      commentsRepository.addCommentCreateListener(() => query.refetch()),
      commentsRepository.addCommentUpdateListener(() => query.refetch()),
      commentsRepository.addCommentDeleteListener(() => query.refetch()),
    ];
    return () => unsubscribes.forEach(run => run());
  }, []);

  return query;
}
