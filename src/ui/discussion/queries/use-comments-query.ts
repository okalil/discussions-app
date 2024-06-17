import { useQuery } from '@tanstack/react-query';
import { getCommentRepository } from '~/data/comment/comment.repository';
import { useStreamQuery } from '~/ui/shared/utils/use-stream-query';

export function useCommentsQuery(discussionId: string) {
  const commentsRepository = getCommentRepository(discussionId);
  return useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    queryFn: useStreamQuery((signal) =>
      commentsRepository.getCommentsStream(signal),
    ),
  });
}
