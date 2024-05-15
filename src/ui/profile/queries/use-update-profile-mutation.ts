import { useMutation } from '@tanstack/react-query';

import { getUserRepository } from '~/data/user/user.repository';
import { UpdateUserDto } from '~/data/user/update-user.dto';
import { Toast } from '~/ui/shared/toast';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => getUserRepository().updateProfile(dto),
    onSuccess: () => Toast.show('Salvo!', Toast.SHORT),
  });
}
