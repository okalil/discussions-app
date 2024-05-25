import React from 'react';
import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '~/ui/shared/avatar';
import { Fab } from '~/ui/shared/fab';
import { Text } from '~/ui/shared/text';
import { useRefresh } from '../shared/utils/use-refresh';
import { useInfiniteDiscussionsQuery } from './queries/use-infinite-discussions-query';

type ScreenProps = BottomTabScreenProps<
  StackParamList & TabParamList,
  'Discussions'
>;

export function DiscussionsScreen({ navigation, route }: ScreenProps) {
  const query = useInfiniteDiscussionsQuery();
  const refresh = useRefresh(() => query.refetch({ throwOnError: true }));

  const scrollYRef = React.useRef(0);

  if (query.isPending)
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator color="black" size="large" />
      </SafeAreaView>
    );

  if (query.isLoadingError)
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Algo deu errado...</Text>
        <Pressable onPress={() => query.refetch()}>
          <Text className="underline">Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );

  const discussions = query.data;

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        {...refresh}
        className="flex-1 px-4"
        data={discussions}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('Discussion', { id: item.id })}
            className="flex-row gap-3 py-4 border-b border-gray-300"
          >
            <View>
              <Avatar
                size={48}
                src={item.user.picture?.url}
                alt={item.user.name}
              />
            </View>

            <Text
              className="flex-1 text-base font-inter-semibold"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text className="text-base font-inter-semibold">{item.votes}</Text>
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
          ) : (
            <View className="h-12" />
          )
        }
        onScroll={e => {
          const previousOffset = scrollYRef.current;
          const currentOffset = e.nativeEvent.contentOffset.y;
          const tabBarVisible =
            currentOffset <= 0 || currentOffset < previousOffset;

          if (tabBarVisible !== route.params?.tabBarVisible) {
            navigation.setParams({ tabBarVisible });
          }

          scrollYRef.current = currentOffset;
        }}
      />

      <Fab
        onPress={() => navigation.navigate('DiscussionForm')}
        icon={<Icon name="plus" color="white" size={24} />}
      />
    </SafeAreaView>
  );
}
