import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Pressable } from 'react-native';

import { Vote } from '~/ui/shared/vote';
import { Text } from '~/ui/shared/text';
import { Comments } from './comments';
import { useDiscussionQuery } from '../queries/use-discussion-query';
import { useVoteDiscussionMutation } from '../queries/use-vote-discussion-mutation';

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
          <Text className="text-lg font-inter-semibold mb-2">
            {discussion.title}
          </Text>
          <Text className="text-base mb-2">{discussion.description}</Text>
          <View>
            <Vote
              voted={voted}
              votes={votes}
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

  if (discussionQuery.isPending)
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
