import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CommentDto } from '~/data/comment/comment.dto';
import { getCommentRepository } from '~/data/comment/comment.repository';
import { useStream } from '~/ui/shared/utils/use-stream';

export function useCommentsQuery(discussionId: string) {
  const commentsRepository = getCommentRepository(discussionId);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    queryFn: () => commentsRepository.getComments(),
  });

  useStream(commentsRepository.getCommentsStream(), (data) =>
    client.setQueryData<CommentDto[]>(
      ['discussions', discussionId, 'comments'],
      data,
    ),
  );

  return query;
}
