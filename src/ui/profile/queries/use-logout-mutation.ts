import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserRepository } from '~/data/user/user.repository';

export function useLogoutMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => getUserRepository().logout(),
    onSuccess: () => client.invalidateQueries({ queryKey: ['user'] }),
  });
}
