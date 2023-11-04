import { View, Text, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

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

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const onChangePicture = async () => {
    if (status && !status.canAskAgain) return;
    const response = await requestPermission();
    if (!response.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync();
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
      <View className="px-4 justify-center flex-1">
        <Text className="text-2xl font-semibold mb-8">Perfil</Text>

        <View className="mb-4 mx-auto">
          <Avatar src={picture.uri} alt="" size={96} />

          <Pressable
            onPress={onChangePicture}
            className={cn(
              'absolute -bottom-1 -right-1 bg-white',
              'px-1 py-1 border border-gray-200 rounded-full'
            )}
          >
            <Icon name="pencil-outline" size={20} />
          </Pressable>
        </View>

        <FormInput name="name" label="Nome" className="mb-4" />

        <Button variant="primary" loading={mutation.isPending} onPress={onSave}>
          Salvar
        </Button>

        <Pressable onPress={onLogout}>
          <Icon name="logout" size={24} />
        </Pressable>
      </View>
    </FormProvider>
  );
}
