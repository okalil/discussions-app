import React from 'react';
import { View, FlatList, Pressable, Alert, BackHandler } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { FadeIn } from 'react-native-reanimated';
import { MotiPressable } from 'moti/interactions';
import { MotiView } from 'moti';

import type { ScreenProps } from './discussion-screen';
import { CommentDto } from '~/data/comment/comment.dto';
import { Vote } from '~/ui/shared/vote';
import { Avatar } from '~/ui/shared/avatar';
import { Text } from '~/ui/shared/text';
import { useUserQuery } from '../profile/queries/use-user-query';
import { useCommentsQuery } from './queries/use-comments-query';
import { useDeleteCommentMutation } from './queries/use-delete-comment-mutation';
import { useVoteCommentMutation } from './queries/use-vote-comment-mutation';
import { CommentForm } from './comment-form';

export function Comments() {
  const params = useRoute<ScreenProps['route']>().params;
  const discussionId = params?.id ?? '';

  const commentsQuery = useCommentsQuery(discussionId);
  const deleteCommentMutation = useDeleteCommentMutation(discussionId);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [comment, setComment] = React.useState<CommentDto | null>(null);
  const [editing, setEditing] = React.useState(false);

  const onOpenCommentOptions = (it: CommentDto) => {
    setComment(it);
    requestAnimationFrame(() => bottomSheetModalRef.current?.present());
  };
  const onDeleteCommentPress = (comment: CommentDto) => {
    bottomSheetModalRef.current?.close();
    Alert.alert('Excluir comentário', 'Excluir comentário permanentemente?', [
      { text: 'Cancelar' },
      {
        text: 'Ok',
        onPress() {
          requestAnimationFrame(() => {
            deleteCommentMutation.mutate(comment);
          });
        },
      },
    ]);
    setComment(null);
  };
  const onEditCommentPress = () => {
    bottomSheetModalRef.current?.close();
    setTimeout(() => setEditing(true), 250);
  };

  useBackHandler(() => {
    if (comment) {
      setComment(null);
      return true;
    }
    return false;
  });

  const user = useUserQuery().data;

  return (
    <React.Fragment>
      <View className="flex-1">
        <FlatList
          data={commentsQuery.data}
          style={{ marginBottom: 40 }}
          keyExtractor={it => it.id}
          renderItem={({ item }) => {
            const isAuthor = user?.id === item.user.id;

            return (
              <MotiView style={{ paddingVertical: 12 }} entering={FadeIn}>
                <View className="flex-row">
                  <Avatar src={item.user.picture?.url} alt={item.user.name} />
                  <Text className="ml-3 mr-auto">{item.user.name}</Text>
                  {isAuthor && (
                    <MotiPressable
                      style={{ borderRadius: 9999 }}
                      animate={({ pressed }) => {
                        'worklet';
                        return {
                          backgroundColor: pressed
                            ? 'lightgray'
                            : 'transparent',
                          opacity: pressed ? 0 : 1,
                        };
                      }}
                      onPress={() => onOpenCommentOptions(item)}
                    >
                      <Icon name="dots-vertical" size={24} />
                    </MotiPressable>
                  )}
                </View>

                <Text className="py-2 px-3">{item.content}</Text>

                <CommentVote comment={item} />
              </MotiView>
            );
          }}
        />

        {comment && (
          <BottomSheetModal
            detached
            ref={bottomSheetModalRef}
            snapPoints={[120]}
            backdropComponent={props => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
              />
            )}
            bottomInset={16}
            style={{ marginHorizontal: 16 }}
          >
            <View className="px-4 py-2">
              <Pressable
                onPress={onEditCommentPress}
                className="flex-row items-center mb-3"
              >
                <Icon name="pencil-outline" size={24} />
                <Text className="ml-3 text-base">Editar</Text>
              </Pressable>
              <Pressable
                className="flex-row items-center"
                onPress={() => onDeleteCommentPress(comment)}
              >
                <Icon name="trash-can-outline" size={24} />
                <Text className="ml-3 text-base">Excluir</Text>
              </Pressable>
            </View>
          </BottomSheetModal>
        )}
      </View>

      <CommentForm
        key={editing && comment ? comment.id : 'add-comment'}
        comment={editing && comment ? comment : undefined}
        editing={editing}
        onCancelEditing={() => {
          setEditing(false);
          setComment(null);
        }}
      />
    </React.Fragment>
  );
}

function CommentVote({ comment }: { comment: CommentDto }) {
  const params = useRoute<ScreenProps['route']>().params;
  const discussionId = params?.id ?? '';
  const commentId = comment.id;

  const mutation = useVoteCommentMutation({ discussionId, commentId });

  const optimisticVoted = mutation.variables;
  const voted = mutation.isPending ? optimisticVoted : comment.voted;

  let votes = comment.votes;
  if (mutation.isPending && optimisticVoted !== comment.voted)
    votes += optimisticVoted ? 1 : -1;

  return (
    <Vote
      voted={voted}
      votes={votes}
      onPress={() => {
        requestAnimationFrame(async () => {
          mutation.mutate(!voted);
        });
      }}
    />
  );
}

function useBackHandler(handler: () => boolean | null | undefined) {
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handler
    );
    return () => subscription.remove();
  }, [handler]);
}
