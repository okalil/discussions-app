import { useMutation } from '@tanstack/react-query';

import type { UpdateUserDto } from '~/data/user/update-user.dto';
import { getUserRepository } from '~/data/user/user.repository';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => getUserRepository().updateProfile(dto),
  });
}
