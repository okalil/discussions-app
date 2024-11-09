import React from 'react';
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const query = useInfiniteDiscussionsQuery();
  const refresh = useRefresh(() => query.refetch({ throwOnError: true }));

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {query.isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="black" size="large" />
        </View>
      ) : query.isLoadingError ? (
        <View className="flex-1 items-center justify-center">
          <Text>Algo deu errado...</Text>
          <Pressable onPress={() => query.refetch()}>
            <Text className="underline">Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl {...refresh} testID="refresh_control" />
          }
          className="flex-1 px-4"
          data={query.data}
          renderItem={({ item }) => (
            <View
              className="flex-row gap-3 py-4 border-gray-300"
              style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            >
              <View>
                <Avatar
                  size={48}
                  src={item.user.picture?.url}
                  alt={item.user.name}
                />
              </View>

              <Text
                testID={`discussion_item_${item.id}`}
                className="flex-1 text-base font-inter-semibold"
                numberOfLines={2}
                onPress={() =>
                  navigation.navigate('Discussion', { id: item.id })
                }
              >
                {item.title}
              </Text>
              <Text className="text-base font-inter-semibold">
                {item.votes}
              </Text>
            </View>
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
        />
      )}

      <Fab
        onPress={() => navigation.navigate('DiscussionForm')}
        icon={<Icon name="plus" color="white" size={24} />}
        accessibilityLabel="Nova Discussão"
      />
    </View>
  );
}
