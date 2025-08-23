import React from 'react';
import { View, Pressable, Alert, BackHandler } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRoute } from '@react-navigation/native';
import {
  KeyboardEvents,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Animated, { FadeIn, useAnimatedStyle } from 'react-native-reanimated';
import type { ListRenderItem } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CommentDto } from '~/data/comment/comment.dto';
import { Avatar } from '~/ui/shared/avatar';
import { Text } from '~/ui/shared/text';
import { Vote } from '~/ui/shared/vote';
import { useCurrentUser } from '../shared/queries/use-user-query';
import { CommentForm } from './comment-form';
import { useCommentsQuery } from './queries/use-comments-query';
import { useDeleteCommentMutation } from './queries/use-delete-comment-mutation';
import { useVoteCommentMutation } from './queries/use-vote-comment-mutation';

interface Props {
  header: React.JSX.Element;
}

export function Comments({ header }: Props) {
  const insets = useSafeAreaInsets();
  const params = useRoute().params as { id: string };
  const discussionId = params?.id ?? '';

  const user = useCurrentUser();
  const { data: comments } = useCommentsQuery(discussionId);
  const deleteCommentMutation = useDeleteCommentMutation(discussionId);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [comment, setComment] = React.useState<CommentDto | null>(null);
  const [editing, setEditing] = React.useState(false);

  useBackHandler(() => {
    if (comment) {
      setComment(null);
      return true;
    }
    return false;
  });

  const { height } = useReanimatedKeyboardAnimation();
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    [],
  );
  const flashListRef = React.useRef<FlashList<CommentDto>>(null);
  const offsetY = React.useRef(0);

  React.useEffect(() => {
    let heightValue = 0;
    const events = [
      KeyboardEvents.addListener('keyboardWillShow', (e) => {
        heightValue = e.height;
        flashListRef.current?.scrollToOffset({
          offset: offsetY.current + heightValue,
          animated: true,
        });
      }),
      KeyboardEvents.addListener('keyboardWillHide', (e) => {
        flashListRef.current?.scrollToOffset({
          offset: offsetY.current - heightValue,
          animated: true,
        });
      }),
    ];
    return () => events.forEach((it) => it.remove());
  });

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

  return (
    <View className="flex-1 justify-end">
      <FlashList
        onScroll={(e) => (offsetY.current = e.nativeEvent.contentOffset.y)}
        ref={flashListRef}
        estimatedItemSize={300}
        ListHeaderComponent={header}
        ListFooterComponent={<Animated.View style={fakeView} />}
        contentContainerStyle={{ padding: 16 }}
        data={[...(comments ?? [])]}
        renderItem={React.useCallback<ListRenderItem<CommentDto>>(
          ({ item }) => {
            const isAuthor = user.id === item.user.id;
            return (
              <Animated.View
                key={item.id}
                style={{ paddingVertical: 12 }}
                entering={FadeIn}
                testID={`comment_item_${item.id}`}
              >
                <View className="flex-row">
                  <Avatar src={item.user.picture?.url} alt={item.user.name} />
                  <Text className="ml-3 mr-auto">{item.user.name}</Text>
                  {isAuthor && (
                    <Pressable
                      onPress={() => onOpenCommentOptions(item)}
                      style={{ borderRadius: 9999 }}
                      // animate={({ pressed }) => {
                      //   'worklet';
                      //   return {
                      //     backgroundColor: pressed
                      //       ? 'lightgray'
                      //       : 'transparent',
                      //     opacity: pressed ? 0 : 1,
                      //   };
                      // }}
                    >
                      <Icon name="dots-vertical" size={24} />
                    </Pressable>
                  )}
                </View>

                <Text className="py-2 px-3">{item.content}</Text>

                <CommentVote comment={item} />
              </Animated.View>
            );
          },
          [],
        )}
        keyExtractor={(it) => it.id}
      />

      {comment && (
        <BottomSheetModal
          detached
          ref={bottomSheetModalRef}
          snapPoints={[120]}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
            />
          )}
          bottomInset={insets.bottom + 16}
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

      <CommentForm
        key={editing && comment ? comment.id : 'add-comment'}
        comment={editing && comment ? comment : undefined}
        editing={editing}
        onCancelEditing={() => {
          const isNewComment = !comment;
          if (isNewComment) {
            setTimeout(() => {
              flashListRef.current?.scrollToEnd();
            }, 500);
          }
          setEditing(false);
          setComment(null);
        }}
      />
    </View>
  );
}

function CommentVote({ comment }: { comment: CommentDto }) {
  const params = useRoute().params as { id: string };
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
      handler,
    );
    return () => subscription.remove();
  }, [handler]);
}
