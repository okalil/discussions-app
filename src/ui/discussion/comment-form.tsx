import React from "react";
import {
  View,
  ActivityIndicator,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import type { CommentDto } from "~/data/comment/comment.dto";
import { Text } from "../shared/text";
import type { ScreenProps } from "./discussion-screen";
import { useSaveCommentMutation } from "./queries/use-save-comment-mutation";

interface Props {
  editing: boolean;
  onCancelEditing: () => void;
  comment?: CommentDto;
}

export function CommentForm({ editing, onCancelEditing, comment }: Props) {
  const params = useRoute<ScreenProps["route"]>().params;
  const discussionId = params?.id ?? "";

  const form = useForm({ defaultValues: comment });
  const content = form.watch("content");

  const { isPending, mutate } = useSaveCommentMutation(discussionId);

  const onSaveComment = () => {
    requestAnimationFrame(() =>
      mutate(
        { id: comment?.id, content },
        {
          onSuccess() {
            form.reset();
            Keyboard.dismiss();
            onCancelEditing();
          },
        }
      )
    );
  };

  const { height } = useReanimatedKeyboardAnimation();
  const textInputStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }],
    }),
    []
  );

  return (
    <Animated.View className="bg-white" style={textInputStyle}>
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
          className=" flex-1 bg-white"
          multiline
          placeholder="Entre na discussão"
          value={content}
          onChangeText={(text) => form.setValue("content", text)}
        />
        <Pressable
          accessibilityLabel="Enviar"
          className="ml-3"
          disabled={!content}
          onPress={onSaveComment}
        >
          {isPending ? (
            <ActivityIndicator color="black" size={24} />
          ) : (
            <Icon name="send" color={content ? undefined : "gray"} size={24} />
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
}