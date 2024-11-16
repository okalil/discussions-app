import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import type { StaticScreenProps } from '@react-navigation/native';
import { Text } from '~/ui/shared/text';
import { Vote } from '~/ui/shared/vote';
import type { DiscussionDto } from '~/data/discussion/discussion.dto';
import {
  useWatchDiscussionUpdates,
  discussionQuery,
} from './queries/use-discussion-query';
import { useVoteDiscussionMutation } from './queries/use-vote-discussion-mutation';
import { Comments } from './comments';

export function DiscussionScreen({ route }: StaticScreenProps<{ id: string }>) {
  const params = route.params;
  const discussionId = params.id;

  useWatchDiscussionUpdates(discussionId); // only receive discussion updates while in this screen

  const {
    data: discussion,
    isLoadingError,
    isPending,
    refetch,
  } = useQuery(discussionQuery(discussionId));

  return (
    <View className="flex-1">
      <Comments
        header={
          isPending ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="black" size="large" />
            </View>
          ) : isLoadingError ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-base">Houve um erro ao carregar</Text>
              <Pressable onPress={() => refetch()}>
                <Text className="underline text-base">Tente novamente.</Text>
              </Pressable>
            </View>
          ) : (
            <DiscussionContent discussion={discussion} />
          )
        }
      />
    </View>
  );
}

function DiscussionContent({ discussion }: { discussion: DiscussionDto }) {
  const votesMutation = useVoteDiscussionMutation(discussion.id);

  const optimisticVoted = votesMutation.variables;
  const voted = votesMutation.isPending ? optimisticVoted : discussion.voted;

  let votes = discussion.votes;
  if (votesMutation.isPending && optimisticVoted !== discussion.voted) {
    votes += optimisticVoted ? 1 : -1;
  }

  return (
    <View>
      <Text
        testID="discussion_title"
        className="text-lg font-inter-semibold mb-2"
      >
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
  );
}
