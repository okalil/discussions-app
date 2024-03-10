import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRepository } from '~/data/user-repository';

export function useRegisterMutation() {
  const client = useQueryClient();
  return useMutation({
    async mutationFn(data: object) {
      const repository = new UserRepository();
      await repository.register(data);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
