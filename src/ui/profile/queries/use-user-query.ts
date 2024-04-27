import { useQuery } from '@tanstack/react-query';
import { getUserRepository } from '~/data/user/user.repository';

export function useUserQuery() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUserRepository().getUser(),
    gcTime: Infinity,
    staleTime: Infinity,
  });
}
