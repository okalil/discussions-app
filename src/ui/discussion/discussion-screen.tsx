import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import React from 'react';

import { DiscussionsRepository } from '~/data/discussions-repository';
import { socket } from '~/data/network/socket';
import { useSocketEvent } from '~/utils/use-socket-event';
import { Comments } from './comments';
import { Vote } from '~/components/vote';

export type ScreenProps = NativeStackScreenProps<StackParamList, 'Discussion'>;

const repository = new DiscussionsRepository();

export function DiscussionScreen({ route }: ScreenProps) {
  const params = route.params;
  const discussionId = params?.id ?? '';

  const client = useQueryClient();
  const discussionQuery = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn() {
      client.prefetchQuery({ queryKey: ['comments'] });
      return repository.getDiscussion(discussionId);
    },
    enabled: !!discussionId,
  });

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

  const discussion = discussionQuery.data;

  const votesMutation = useMutation({
    async mutationFn(voted: boolean) {
      return voted
        ? repository.upvoteDiscussion(discussionId)
        : repository.downvoteDiscussion(discussionId);
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId],
      });
    },
  });

  if (discussion) {
    const optimisticVoted = votesMutation.variables;
    const voted = votesMutation.isPending ? optimisticVoted : discussion.voted;

    let votes = discussion.votes;
    if (votesMutation.isPending && optimisticVoted !== discussion.voted) {
      votes += optimisticVoted ? 1 : -1;
    }

    return (
      <View className="flex-1 px-4 py-4">
        <View>
          <Text className="text-lg font-semibold mb-2">{discussion.title}</Text>
          <Text className="text-base mb-2">{discussion.description}</Text>
          <View>
            <Vote
              voted={voted}
              count={votes}
              onPress={() => {
                requestAnimationFrame(async () => {
                  votesMutation.mutate(!voted);
                });
              }}
            />
          </View>
        </View>

        <Comments />
      </View>
    );
  }

  if (discussionQuery.status === 'pending')
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Houve um erro ao carregar</Text>
      <Pressable onPress={() => discussionQuery.refetch()}>
        <Text>Tente novamente.</Text>
      </Pressable>
    </View>
  );
}
