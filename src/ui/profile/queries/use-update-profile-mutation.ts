import { ToastAndroid } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { getUserRepository } from '~/data/user/user.repository';
import { UpdateUserDto } from '~/data/user/update-user.dto';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => getUserRepository().updateProfile(dto),
    onSuccess: () => ToastAndroid.show('Salvo!', ToastAndroid.SHORT),
    onError: () => ToastAndroid.show('Erro ao salvar', ToastAndroid.SHORT),
  });
}
