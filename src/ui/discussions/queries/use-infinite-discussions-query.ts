import { useInfiniteQuery } from '@tanstack/react-query';
import { DiscussionsRepository } from '~/data/discussions-repository';

export function useInfiniteDiscussionsQuery() {
  return useInfiniteQuery({
    queryKey: ['discussions'],
    queryFn(context) {
      const page = context.pageParam;
      const repository = new DiscussionsRepository();
      return repository.getDiscussions({ page });
    },
    initialPageParam: 1,
    getNextPageParam(last) {
      return last.next;
    },
    select(state) {
      return state.pages.flatMap(it => it.data);
    },
  });
}
