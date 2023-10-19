import { FlatList, Text } from 'react-native';
import { View } from 'react-native';
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { DiscussionsRepository } from '~/data/discussions-repository';

const repository = new DiscussionsRepository();

export function DiscussionsScreen() {
  const query = useInfiniteQuery({
    queryKey: ['discussions'],
    queryFn(context) {
      const page = context.pageParam;
      return repository.getDiscussions({ page });
    },
    initialPageParam: 1,
    getNextPageParam(last) {
      return last.next;
    },
    select(state) {
      type T = (typeof state)['pages'][number]['data'];
      return state.pages.reduce<T>((result, it) => result.concat(it.data), []);
    },
  });

  const discussions = query.data;

  return (
    <View>
      <FlatList
        data={discussions}
        renderItem={({ item }) => (
          <Text className="px-3 py-4">{item.title}</Text>
        )}
        onEndReached={() => query.fetchNextPage()}
      />
    </View>
  );
}
