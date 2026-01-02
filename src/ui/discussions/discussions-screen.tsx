import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Avatar } from '~/ui/shared/avatar';
import { Fab } from '~/ui/shared/fab';
import { Text } from '~/ui/shared/text';
import { useRefresh } from '../shared/utils/use-refresh';
import { useSuspenseDiscussionsInfiniteQuery } from './queries/use-infinite-discussions-query';
import { Await } from '../shared/await';

export function DiscussionsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <Await>
        <DiscussionsList />
      </Await>

      <Fab
        onPress={() => navigation.navigate('DiscussionForm')}
        icon={<Icon name="plus" color="white" size={24} />}
        accessibilityLabel="Nova Discussão"
      />
    </View>
  );
}

function DiscussionsList() {
  const query = useSuspenseDiscussionsInfiniteQuery();
  const refresh = useRefresh(() => query.refetch({ throwOnError: true }));
  const navigation = useNavigation();

  return (
    <FlatList
      refreshControl={<RefreshControl {...refresh} testID="refresh_control" />}
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
            onPress={() => navigation.navigate('Discussion', { id: item.id })}
          >
            {item.title}
          </Text>
          <Text className="text-base font-inter-semibold">{item.votes}</Text>
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
  );
}
