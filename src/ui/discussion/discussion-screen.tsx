import React from 'react';
import { View } from 'react-native';
import type { StaticScreenProps } from '@react-navigation/native';
import { Text } from '~/ui/shared/text';
import { Vote } from '~/ui/shared/vote';
import { Await } from '~/ui/shared/await';
import {
  useWatchDiscussionUpdates,
  useSuspenseDiscussionQuery,
} from './queries/use-discussion-query';
import { useVoteDiscussionMutation } from './queries/use-vote-discussion-mutation';
import { Comments } from './comments';

export type ScreenProps = StaticScreenProps<{ id: string }>;

export function DiscussionScreen({ route }: ScreenProps) {
  const params = route.params;
  const discussionId = params.id;

  useWatchDiscussionUpdates(discussionId); // only receive discussion updates while in this screen

  return (
    <View className="flex-1">
      <Await>
        <Comments header={<DiscussionContent discussionId={discussionId} />} />
      </Await>
    </View>
  );
}

function DiscussionContent({ discussionId }: { discussionId: string }) {
  const { data: discussion } = useSuspenseDiscussionQuery(discussionId);
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
          onPress={() => votesMutation.mutate(!voted)}
        />
      </View>
    </View>
  );
}
