import { ToastAndroid } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { UserRepository } from '~/data/user-repository';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn(data: { name: string; picture: { uri: string } }) {
      const repository = new UserRepository();
      return repository.updateProfile({
        name: data.name,
        picture: data.picture.uri,
      });
    },
    onSuccess: () => ToastAndroid.show('Salvo!', ToastAndroid.SHORT),
    onError: () => ToastAndroid.show('Erro ao salvar', ToastAndroid.SHORT),
  });
}
