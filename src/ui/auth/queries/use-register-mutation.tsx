import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserRepository } from '~/data/user/user.repository';
import { RegisterDto } from '~/data/user/register.dto';

export function useRegisterMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: RegisterDto) => getUserRepository().register(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
