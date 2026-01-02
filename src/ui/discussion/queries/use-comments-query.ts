import { useSuspenseQuery } from '@tanstack/react-query';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useSuspenseCommentsQuery(discussionId: string) {
  const commentsRepository = getCommentRepository(discussionId);
  return useSuspenseQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    queryFn: () => commentsRepository.getComments(),
  });
}
