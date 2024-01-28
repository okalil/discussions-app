import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormProvider, useForm } from 'react-hook-form';

import { UserRepository } from '~/data/user-repository';
import { Avatar } from '~/ui/shared/avatar';
import { Button } from '~/ui/shared/button';
import { FormInput } from '~/ui/shared/form-input';
import { cn } from '~/ui/shared/utils';
import { useUserQuery } from './queries/use-user-query';
import { useUpdateProfileMutation } from './queries/use-update-profile-mutation';

export function ProfileScreen() {
  const { data: user, refetch } = useUserQuery();

  const onLogout = () => {
    const repository = new UserRepository();
    repository.logout();
    refetch();
  };

  const form = useForm({
    defaultValues: {
      name: user?.name ?? '',
      picture: { uri: user?.picture?.url ?? '' },
    },
  });
  const picture = form.watch('picture');

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const onEditPicturePress = () => {
    bottomSheetModalRef.current?.present();
  };

  const mediaLibraryPermissions = ImagePicker.useMediaLibraryPermissions();
  const cameraPermissions = ImagePicker.useCameraPermissions();

  const onPickFromLibrary = async () => {
    requestAnimationFrame(() => bottomSheetModalRef.current?.close());

    const [status, requestPermission] = mediaLibraryPermissions;
    if (status && !status.canAskAgain) return;
    const response = await requestPermission();
    if (!response.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync();
    if (result.canceled) return;
    const [image] = result.assets;
    form.setValue('picture', image);
  };
  const onPickFromCamera = async () => {
    requestAnimationFrame(() => bottomSheetModalRef.current?.close());

    const [status, requestPermission] = cameraPermissions;
    if (status && !status.canAskAgain) return;
    const response = await requestPermission();
    if (!response.granted) return;
    const result = await ImagePicker.launchCameraAsync();
    if (result.canceled) return;
    const [image] = result.assets;
    form.setValue('picture', image);
  };

  const mutation = useUpdateProfileMutation();

  const onSave = form.handleSubmit(data => mutation.mutate(data));

  if (!user) {
    return <Text>Sem dados</Text>;
  }

  return (
    <FormProvider {...form}>
      <SafeAreaView className="px-4 py-4 flex-1">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-2xl font-semibold">Perfil</Text>
          <Pressable onPress={onLogout}>
            <Icon name="logout" size={24} />
          </Pressable>
        </View>

        <View className="flex-1 justify-center">
          <View className="mx-auto mb-12">
            <Avatar src={picture.uri} alt={user.name ?? ''} size={96} />

            <Pressable
              onPress={onEditPicturePress}
              className={cn(
                'absolute -bottom-1 -right-1 bg-white',
                'px-1 py-1 border border-gray-200 rounded-full'
              )}
            >
              <Icon name="pencil-outline" size={20} />
            </Pressable>

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

          <FormInput name="name" label="Nome" className="mb-8" />

          <Button
            variant="primary"
            loading={mutation.isPending}
            onPress={onSave}
          >
            Salvar
          </Button>
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}
