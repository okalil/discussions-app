import { useInfiniteQuery } from '@tanstack/react-query';
import { getDiscussionRepository } from '~/data/discussion/discussion.repository';

export function useInfiniteDiscussionsQuery() {
  return useInfiniteQuery({
    queryKey: ['discussions'],
    queryFn(context) {
      const page = context.pageParam;
      return getDiscussionRepository().getDiscussions({ page });
    },
    initialPageParam: 1,
    getNextPageParam: previous => previous.next,
    select: state => state.pages.flatMap(it => it.data),
  });
}
