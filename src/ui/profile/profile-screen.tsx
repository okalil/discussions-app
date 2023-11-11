import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';

import { useUserQuery } from '../navigation/user-query';
import { UserRepository } from '~/data/user-repository';
import { Avatar } from '~/components/avatar';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';
import { cn } from '~/utils/classnames';
import { useUpdateProfileMutation } from './profile-query';

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
      <View className="px-4 py-4 flex-1">
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
      </View>
    </FormProvider>
  );
}
