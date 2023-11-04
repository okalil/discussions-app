import {
  View,
  ActivityIndicator,
  Pressable,
  TextInput,
  Keyboard,
  Text,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import React from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

import { Comment } from '~/data/comment';
import { ScreenProps } from './discussion-screen';
import { useUpsertCommentMutation } from './comments-query';

interface Props {
  editing: boolean;
  onCancelEditing: () => void;
  comment?: Comment;
}

export function CommentForm({ editing, onCancelEditing, comment }: Props) {
  const params = useRoute<ScreenProps['route']>().params;
  const discussionId = params?.id ?? '';

  const form = useForm({ defaultValues: comment });
  const content = form.watch('content');

  const { isPending, mutate } = useUpsertCommentMutation({
    discussionId,
    comment,
    onSuccess() {
      form.reset();
      Keyboard.dismiss();
      onCancelEditing();
    },
  });

  const height = useKeyboardHeight();

  return (
    <MotiView
      className="flex-1 absolute bottom-0 left-0 right-0 bg-gray-200"
      animate={{ bottom: height }}
      transition={{ type: 'timing', duration: height === 0 ? 150 : 300 }}
    >
      {editing && (
        <View className="py-2 px-2 flex-row items-center bg-gray-300">
          <Pressable onPress={onCancelEditing}>
            <Icon name="close-circle" size={24} />
          </Pressable>
          <Text className="ml-3">Editando mensagem</Text>
        </View>
      )}

      <View className="flex-row px-4 py-4">
        <TextInput
          autoFocus={editing}
          className="flex-1 bg-white"
          multiline
          placeholder="Entre na discussão"
          value={content}
          onChangeText={text => form.setValue('content', text)}
        />
        <Pressable
          className="ml-3"
          disabled={!content}
          onPress={() => {
            requestAnimationFrame(() => mutate({ content }));
          }}
        >
          {isPending ? (
            <ActivityIndicator color="black" size={24} />
          ) : (
            <Icon name="send" color={content ? undefined : 'gray'} size={24} />
          )}
        </Pressable>
      </View>
    </MotiView>
  );
}

function useKeyboardHeight() {
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    const subscriptions = [
      Keyboard.addListener('keyboardWillHide', e => {
        setHeight(0);
      }),
      Keyboard.addListener('keyboardWillShow', e => {
        setHeight(e.endCoordinates.height);
      }),
    ];
    return () => subscriptions.forEach(it => it.remove());
  }, []);
  return height;
}
