import React from "react";
import { View, Pressable, Alert } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import type { UpdateUserDto } from "~/data/user/update-user.dto";
import { Avatar } from "~/ui/shared/avatar";
import { Button } from "~/ui/shared/button";
import { FormInput } from "~/ui/shared/form-input";
import { Text } from "~/ui/shared/text";
import { cn } from "~/ui/shared/utils/cn";
import { useUserQuery } from "../shared/queries/use-user-query";
import { Toast } from "../shared/toast";
import { useLogoutMutation } from "./queries/use-logout-mutation";
import { useUpdateProfileMutation } from "./queries/use-update-profile-mutation";

export function ProfileScreen() {
  const { data: user } = useUserQuery();
  const logout = useLogoutMutation();
  const updateProfile = useUpdateProfileMutation();
  const form = useForm<UpdateUserDto>({
    defaultValues: {
      name: user?.name ?? "",
      picture: { uri: user?.picture?.url ?? "" },
    },
  });
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const mediaLibraryPermissions = ImagePicker.useMediaLibraryPermissions();
  const cameraPermissions = ImagePicker.useCameraPermissions();

  const picture = form.watch("picture");
  const onEditPicturePress = () => bottomSheetModalRef.current?.present();
  const parseAssetToLocalFile = (
    asset: ImagePicker.ImagePickerAsset
  ): LocalFile => {
    const file: LocalFile = {
      uri: asset.uri,
      name: asset.fileName ?? "",
      type: asset.mimeType ?? "",
    };
    return file;
  };
  const onPickFromLibrary = async () => {
    requestAnimationFrame(() => bottomSheetModalRef.current?.close());

    const [status, requestPermission] = mediaLibraryPermissions;
    if (status && !status.canAskAgain) return;
    const response = await requestPermission();
    if (!response.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync();
    if (result.canceled) return;
    const [asset] = result.assets;
    form.setValue("picture", parseAssetToLocalFile(asset));
  };
  const onPickFromCamera = async () => {
    requestAnimationFrame(() => bottomSheetModalRef.current?.close());

    const [status, requestPermission] = cameraPermissions;
    if (status && !status.canAskAgain) return;
    const response = await requestPermission();
    if (!response.granted) return;
    const result = await ImagePicker.launchCameraAsync();
    if (result.canceled) return;
    const [asset] = result.assets;
    form.setValue("picture", parseAssetToLocalFile(asset));
  };

  const onSave = form.handleSubmit((data) =>
    updateProfile.mutate(data, {
      onSuccess: () => Toast.show("Salvo!", Toast.SHORT),
    })
  );

  if (!user) {
    return <Text>Sem dados</Text>;
  }

  return (
    <FormProvider {...form}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <SafeAreaView className="px-4 py-4 flex-1">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-2xl font-inter-semibold">Perfil</Text>
            <Pressable
              accessibilityLabel="Sair"
              onPress={() =>
                Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
                  { style: "cancel", text: "Não" },
                  {
                    style: "default",
                    text: "Sim",
                    isPreferred: true,
                    onPress: () => logout.mutate(),
                  },
                ])
              }
            >
              <Icon name="logout" size={24} />
            </Pressable>
          </View>

          <View className="flex-1 justify-center">
            <View className="mx-auto mb-12">
              <Avatar src={picture?.uri} alt={user.name ?? ""} size={96} />

              <Pressable
                onPress={onEditPicturePress}
                className={cn(
                  "absolute -bottom-1 -right-1 bg-white",
                  "px-1 py-1 border border-gray-200 rounded-full"
                )}
                accessibilityLabel="Editar Foto de Perfil"
              >
                <Icon name="pencil-outline" size={20} />
              </Pressable>

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
                    onPress={onPickFromLibrary}
                    className="flex-row items-center mb-3"
                  >
                    <Icon name="image" size={24} />
                    <Text className="ml-3 text-base">Galeria</Text>
                  </Pressable>
                  <Pressable
                    className="flex-row items-center"
                    onPress={onPickFromCamera}
                  >
                    <Icon name="camera" size={24} />
                    <Text className="ml-3 text-base">Câmera</Text>
                  </Pressable>
                </View>
              </BottomSheetModal>
            </View>

            <FormInput
              name="name"
              label="Nome"
              className="mb-8"
              testID="input_name"
            />

            <Button
              testID="submit_button"
              variant="primary"
              loading={updateProfile.isPending}
              onPress={onSave}
            >
              Salvar
            </Button>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
