import {
  View,
  ActivityIndicator,
  Pressable,
  TextInput,
  Keyboard,
  Text,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import React from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { Comment } from '~/data/comment';
import { CommentsRepository } from '~/data/comments-repository';
import { ScreenProps } from './discussion-screen';

interface Props {
  editing: boolean;
  onCancelEditing: () => void;
  comment?: Comment;
}

export function AddEditComment({ editing, onCancelEditing, comment }: Props) {
  const params = useRoute<ScreenProps['route']>().params;
  const discussionId = params?.id ?? '';

  const form = useForm({ defaultValues: comment });
  const content = form.watch('content');

  const client = useQueryClient();
  const { isPending, mutate } = useMutation({
    async mutationFn() {
      const commentsRepository = new CommentsRepository();
      if (comment) {
        await commentsRepository.updateComment(
          { discussionId, commentId: comment.id },
          { content }
        );
      } else {
        await commentsRepository.createComment({ discussionId }, { content });
      }
      client.invalidateQueries({
        queryKey: ['discussions', discussionId, 'comments'],
      });
    },
    onSuccess() {
      form.reset();
      Keyboard.dismiss();
      onCancelEditing();
    },
  });

  return (
    <View>
      {editing && (
        <View className="py-2 px-2 flex-row items-center">
          <Pressable onPress={onCancelEditing}>
            <Icon name="close-circle" size={24} />
          </Pressable>
          <Text className="ml-3">Editando mensagem</Text>
        </View>
      )}

      <View className="flex-row gap-3">
        <TextInput
          autoFocus={editing}
          className="flex-1 bg-white"
          multiline
          placeholder="Entre na discussão"
          value={content}
          onChangeText={text => form.setValue('content', text)}
        />
        <Pressable
          disabled={!content}
          onPress={() => {
            requestAnimationFrame(() => mutate());
          }}
        >
          {isPending ? (
            <ActivityIndicator color="black" size={24} />
          ) : (
            <Icon
              name="send"
              color={content ? undefined : 'lightgray'}
              size={24}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
