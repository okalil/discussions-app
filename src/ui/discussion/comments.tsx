import React from "react";
import { View, StyleSheet, Pressable, Alert, BackHandler } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { FadeIn, useAnimatedStyle } from "react-native-reanimated";

import type { CommentDto } from "~/data/comment/comment.dto";
import { Avatar } from "~/ui/shared/avatar";
import { Text } from "~/ui/shared/text";
import { Vote } from "~/ui/shared/vote";
import { useUserQuery } from "../shared/queries/use-user-query";
import { CommentForm } from "./comment-form";
import type { ScreenProps } from "./discussion-screen";
import { useCommentsQuery } from "./queries/use-comments-query";
import { useDeleteCommentMutation } from "./queries/use-delete-comment-mutation";
import { useVoteCommentMutation } from "./queries/use-vote-comment-mutation";

interface Props {
  header: JSX.Element;
}

export function Comments({ header }: Props) {
  const params = useRoute<ScreenProps["route"]>().params;
  const discussionId = params?.id ?? "";

  const { data: comments } = useCommentsQuery(discussionId);
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
    Alert.alert("Excluir comentário", "Excluir comentário permanentemente?", [
      { text: "Cancelar" },
      {
        text: "Ok",
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
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);

  const { height } = useReanimatedKeyboardAnimation();
  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }, ...styles.inverted.transform],
    }),
    []
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  );

  return (
    <View className="flex-1 justify-end">
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          justifyContent: "flex-end",
          flexGrow: 1,
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}
        style={scrollViewStyle}
        onLayout={() => scrollViewRef.current?.scrollToEnd()}
      >
        <View style={styles.inverted}>
          <Animated.View style={fakeView} />
          {header}
          {comments?.map((item) => {
            const isAuthor = user?.id === item.user.id;
            return (
              <MotiView
                key={item.id}
                style={{ paddingVertical: 12 }}
                entering={FadeIn}
              >
                <View className="flex-row">
                  <Avatar src={item.user.picture?.url} alt={item.user.name} />
                  <Text className="ml-3 mr-auto">{item.user.name}</Text>
                  {isAuthor && (
                    <MotiPressable
                      style={{ borderRadius: 9999 }}
                      animate={({ pressed }) => {
                        "worklet";
                        return {
                          backgroundColor: pressed
                            ? "lightgray"
                            : "transparent",
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
          })}
        </View>
      </Animated.ScrollView>

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

      <CommentForm
        // key={editing && comment ? comment.id : "add-comment"}
        comment={editing && comment ? comment : undefined}
        editing={editing}
        onCancelEditing={() => {
          const isNewComment = !comment;
          if (isNewComment) {
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            });
          }
          setEditing(false);
          setComment(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inverted: { transform: [{ rotate: "180deg" }] },
});

function CommentVote({ comment }: { comment: CommentDto }) {
  const params = useRoute<ScreenProps["route"]>().params;
  const discussionId = params?.id ?? "";
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
      "hardwareBackPress",
      handler
    );
    return () => subscription.remove();
  }, [handler]);
}
