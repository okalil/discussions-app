import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  BackHandler,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';

import { Comment } from '~/data/comment';
import { CommentsRepository } from '~/data/comments-repository';
import { ScreenProps } from './discussion-screen';
import { AddEditComment } from './add-edit-comment';
import { cn } from '~/utils/classnames';
import { Avatar } from '~/components/avatar';
import { Vote } from '~/components/vote';
import { useSocketEvent } from '~/utils/use-socket-event';
import { useUserQuery } from '../navigation/use-user-query';

const repository = new CommentsRepository();

export function Comments() {
  const params = useRoute<ScreenProps['route']>().params;
  const discussionId = params?.id ?? '';

  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['discussions', discussionId, 'comments'],
    async queryFn() {
      return repository.getComments(discussionId);
    },
  });

  useSocketEvent('comment_create', () => {
    query.refetch();
  });
  useSocketEvent('comment_delete', () => {
    query.refetch();
  });
  useSocketEvent('comment_update', () => {
    query.refetch();
  });

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [comment, setComment] = React.useState<Comment | null>(null);
  const [editing, setEditing] = React.useState(false);

  const onOpenCommentOptions = (it: Comment) => {
    setComment(it);
    requestAnimationFrame(() => bottomSheetModalRef.current?.present());
  };
  const onDeleteCommentPress = (comment: Comment) => {
    bottomSheetModalRef.current?.close();
    Alert.alert('Excluir comentário', 'Excluir comentário permanentemente?', [
      { text: 'Cancelar' },
      {
        text: 'Ok',
        onPress() {
          requestAnimationFrame(async () => {
            const commentsRepository = new CommentsRepository();
            await commentsRepository.deleteComment({
              discussionId,
              commentId: comment.id,
            });
            client.invalidateQueries({
              queryKey: ['discussions', discussionId, 'comments'],
            });
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
          data={query.data}
          renderItem={({ item }) => {
            const isAuthor = user?.id === item.user.id;

            return (
              <Pressable
                onLongPress={
                  isAuthor ? () => onOpenCommentOptions(item) : undefined
                }
              >
                <View className={cn('py-3')}>
                  <View className="flex-row">
                    <Avatar src={item.user.picture?.url} alt={item.user.name} />
                    <Text className="ml-3">{item.user.name}</Text>
                    {isAuthor && (
                      <Pressable
                        className="ml-auto"
                        onPress={() => onOpenCommentOptions(item)}
                      >
                        <Icon name="dots-vertical" size={24} />
                      </Pressable>
                    )}
                  </View>

                  <Text className="py-2 px-3">{item.content}</Text>

                  <CommentVote comment={item} />
                </View>
              </Pressable>
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

      <AddEditComment
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

function CommentVote({ comment }: { comment: Comment }) {
  const params = useRoute<ScreenProps['route']>().params;
  const discussionId = params?.id ?? '';
  const commentId = comment.id;

  const client = useQueryClient();
  const mutation = useMutation({
    async mutationFn(voted: boolean) {
      return voted
        ? repository.upvoteComment({ commentId, discussionId })
        : repository.downvoteComment({ commentId, discussionId });
    },
    onSettled() {
      return client.invalidateQueries({
        queryKey: ['discussions', discussionId],
      });
    },
  });

  const optimisticVoted = mutation.variables;
  const voted = mutation.isPending ? optimisticVoted : comment.voted;

  let votes = comment.votes;
  if (mutation.isPending && optimisticVoted !== comment.voted)
    votes += optimisticVoted ? 1 : -1;

  return (
    <Vote
      voted={voted}
      count={votes}
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
