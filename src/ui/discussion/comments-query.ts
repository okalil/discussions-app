import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Comment } from '~/data/comment';
import { CommentsRepository } from '~/data/comments-repository';
import { useSocketEvent } from '~/utils/use-socket-event';

interface Props {
  discussionId: string;
}

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
      const repository = new CommentsRepository();
      return repository.getComments(discussionId);
    },
    select(data) {
      if (deletedComment) {
        return data.filter(it => it.id !== deletedComment.id);
      }
      return data;
    },
  });

  useSocketEvent('comment_create', () => {
    query.refetch();
  });
  useSocketEvent('comment_delete', () => {
    query.refetch();
  });
  useSocketEvent('comment_update', () => {
    query.refetch();
  });

  return query;
}

export function useUpsertCommentMutation({
  discussionId,
  comment,
  onSuccess,
}: {
  discussionId: string;
  comment?: Comment;
  onSuccess: () => void;
}) {
  const client = useQueryClient();
  return useMutation({
    async mutationFn({ content }: Pick<Comment, 'content'>) {
      const commentsRepository = new CommentsRepository();
      if (comment) {
        await commentsRepository.updateComment(
          { discussionId, commentId: comment.id },
          { content }
        );
      } else {
        await commentsRepository.createComment({ discussionId }, { content });
      }
      client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
    onSuccess,
  });
}

export function useDeleteCommentMutation({ discussionId }: Props) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ['delete_comment', discussionId],
    async mutationFn(comment: Comment) {
      const commentsRepository = new CommentsRepository();
      await commentsRepository.deleteComment({
        discussionId,
        commentId: comment.id,
      });
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
  });
}

interface VoteCommentProps {
  discussionId: string;
  commentId: string;
}

export function useVoteCommentMutation({
  discussionId,
  commentId,
}: VoteCommentProps) {
  const client = useQueryClient();
  const mutation = useMutation({
    async mutationFn(voted: boolean) {
      const repository = new CommentsRepository();
      return voted
        ? repository.upvoteComment({ commentId, discussionId })
        : repository.downvoteComment({ commentId, discussionId });
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId],
      });
    },
  });
  return mutation;
}
