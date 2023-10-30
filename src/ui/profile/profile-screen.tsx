import { View, Text, Pressable, ToastAndroid } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';

import { useUserQuery } from '../navigation/use-user-query';
import { UserRepository } from '~/data/user-repository';
import { Avatar } from '~/components/avatar';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';
import { cn } from '~/utils/classnames';

const repository = new UserRepository();

export function ProfileScreen() {
  const { data: user, refetch } = useUserQuery();

  const onLogout = () => {
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

  const mutation = useMutation({
    mutationFn() {
      const data = form.getValues();
      return repository.updateProfile({
        name: data.name,
        picture: data.picture.uri,
      });
    },
    onSuccess() {
      ToastAndroid.show('Salvo!', ToastAndroid.SHORT);
    },
    onError(error) {
      ToastAndroid.show('Erro', ToastAndroid.SHORT);
    }
  });

  const onSave = form.handleSubmit(() => mutation.mutate());

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
