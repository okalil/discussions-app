import React from 'react';
import { View, Image, FlatList, Pressable, Text } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DiscussionsRepository } from '~/data/discussions-repository';
import { cn } from '~/utils/classnames';

const repository = new DiscussionsRepository();

type ScreenProps = NativeStackScreenProps<StackParamList>;

export function DiscussionsScreen({ navigation }: ScreenProps) {
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
    <View className="flex-1">
      <FlatList
        className="flex-1 px-4"
        data={discussions}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('Discussion', { id: item.id })}
            className="flex-row gap-3 py-4 border-b border-gray-300"
          >
            <View>
              {item.user.picture?.url ? (
                <Image
                  className="h-12 w-12 rounded-full"
                  source={{
                    uri:
                      'https://discussions-api.onrender.com' +
                      item.user.picture.url,
                  }}
                />
              ) : (
                <View
                  className={cn(
                    'h-12 w-12 items-center justify-center',
                    'border border-gray-300 rounded-full'
                  )}
                >
                  <Text>{item.user.name.at(0)}</Text>
                </View>
              )}
            </View>
            <Text className="text-base font-semibold">{item.title}</Text>
          </Pressable>
        )}
        onEndReached={() => query.fetchNextPage()}
      />
    </View>
  );
}
