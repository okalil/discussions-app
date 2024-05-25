import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RegisterDto } from '~/data/user/register.dto';
import { getUserRepository } from '~/data/user/user.repository';

export function useRegisterMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: RegisterDto) => getUserRepository().register(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
