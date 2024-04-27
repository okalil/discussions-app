import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginDto } from '~/data/user/login.dto';
import { getUserRepository } from '~/data/user/user.repository';

export function useLoginMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => getUserRepository().login(dto),
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
