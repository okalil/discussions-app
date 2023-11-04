import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import React from 'react';

import { Comments } from './comments';
import { Vote } from '~/components/vote';
import {
  useDiscussionQuery,
  useVoteDiscussionMutation,
} from './discussion-query';

export type ScreenProps = NativeStackScreenProps<StackParamList, 'Discussion'>;

export function DiscussionScreen({ route }: ScreenProps) {
  const params = route.params;
  const discussionId = params?.id ?? '';

  const discussionQuery = useDiscussionQuery({ discussionId });
  const discussion = discussionQuery.data;

  const votesMutation = useVoteDiscussionMutation({ discussionId });

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
        <ActivityIndicator color="black" size="large" />
      </View>
    );

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-base">Houve um erro ao carregar</Text>
      <Pressable onPress={() => discussionQuery.refetch()}>
        <Text className="underline text-base">Tente novamente.</Text>
      </Pressable>
    </View>
  );
}
