import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getDiscussionRepository } from '~/data/discussion/discussion.repository';

export function useSuspenseDiscussionsInfiniteQuery() {
  return useSuspenseInfiniteQuery({
    queryKey: ['discussions', 'infinite'],
    queryFn(context) {
      const page = context.pageParam;
      return getDiscussionRepository().getDiscussions({ page });
    },
    initialPageParam: 1,
    getNextPageParam: (previous) => previous.next,
    select: (state) => state.pages.flatMap((it) => it.data),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
