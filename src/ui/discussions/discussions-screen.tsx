import React from 'react';
import {
  View,
  Image,
  FlatList,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { DiscussionsRepository } from '~/data/discussions-repository';
import { cn } from '~/utils/classnames';
import { Fab } from '~/components/fab';

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
      return state.pages.flatMap(it => it.data);
    },
  });

  const discussions = query.data;

  if (query.status === 'success')
    return (
      <View className="flex-1">
        <FlatList
          refreshing={query.isRefetching}
          onRefresh={() => query.refetch()}
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
              <Text className="text-base font-semibold">
                {item.votes_count}
              </Text>
            </Pressable>
          )}
          onEndReached={() => query.fetchNextPage()}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator
                color="black"
                size="large"
                style={{ paddingVertical: 20 }}
              />
            ) : null
          }
        />

        <Fab
          onPress={() => navigation.navigate('DiscussionForm')}
          icon={<Icon name="plus" color="white" size={24} />}
        />
      </View>
    );

  if (query.status === 'pending') {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="black" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Algo deu errado...</Text>
      <Pressable onPress={() => query.refetch()}>
        <Text>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}
