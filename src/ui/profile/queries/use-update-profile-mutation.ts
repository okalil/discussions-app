import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateUserDto } from '~/data/user/update-user.dto';
import { getUserRepository } from '~/data/user/user.repository';

export function useUpdateProfileMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => getUserRepository().updateProfile(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
