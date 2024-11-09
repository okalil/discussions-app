import { useQuery } from '@tanstack/react-query';
import { getCommentRepository } from '~/data/comment/comment.repository';

export function useCommentsQuery(discussionId: string) {
  const commentsRepository = getCommentRepository(discussionId);
  return useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    queryFn: () => commentsRepository.getComments(),
  });
}
