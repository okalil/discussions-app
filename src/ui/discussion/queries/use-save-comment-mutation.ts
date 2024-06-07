import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentRepository } from "~/data/comment/comment.repository";

export function useSaveCommentMutation(discussionId: string) {
  const client = useQueryClient();
  return useMutation({
    async mutationFn({ id, content }: { id?: string; content: string }) {
      const commentsRepository = getCommentRepository(discussionId);
      return id
        ? commentsRepository.updateComment(id, { content })
        : commentsRepository.createComment({ content });
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["discussions", discussionId, "comments"],
      });
    },
  });
}
