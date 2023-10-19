import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';

import { DiscussionsRepository } from '~/data/discussions-repository';
import { cn } from '~/utils/classnames';
import { socket } from '~/data/network/socket';
import { useSocketEvent } from '~/utils/use-socket-event';

type ScreenProps = NativeStackScreenProps<StackParamList, 'Discussion'>;

const repository = new DiscussionsRepository();

export function DiscussionScreen({ route }: ScreenProps) {
  const params = route.params;
  const discussionId = params?.id ?? '';

  const discussionQuery = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn() {
      return repository.getDiscussion(discussionId);
    },
    enabled: !!discussionId,
  });
  const discussion = discussionQuery.data;

  React.useEffect(() => {
    socket.emit('discussion_subscribe', discussionId);
    return () => {
      socket.emit('discussion_unsubscribe', discussionId);
    };
  }, [discussionId]);

  useSocketEvent('discussion_update', async id => {
    if (id === discussionId) {
      discussionQuery.refetch();
    }
  });

  if (discussionQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 py-4">
      <Text className="text-lg font-semibold mb-2">{discussion?.title}</Text>
      <View>
        <Pressable
          className={cn(
            'flex-row items-center w-12 ml-auto',
            'px-2 py-1 border rounded-xl',
            discussion?.user_voted ? 'border-blue-500' : 'border-gray-200'
          )}
          onPress={() => {
            requestAnimationFrame(async () => {
              await (discussion?.user_voted
                ? repository.downvoteDiscussion(discussionId)
                : repository.upvoteDiscussion(discussionId));
              discussionQuery.refetch();
            });
          }}
        >
          <Icon
            name="arrow-up"
            color={discussion?.user_voted ? 'rgb(59 130 246)' : undefined}
            size={16}
          />
          <Text className={cn(discussion?.user_voted && 'text-blue-500')}>
            {discussion?.votes_count}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
