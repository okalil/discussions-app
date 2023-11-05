import { UserRepository } from '../../data/user-repository';
import { useQuery } from '@tanstack/react-query';

const userRepository = new UserRepository();

export function useUserQuery() {
  return useQuery({
    queryKey: ['user'],
    queryFn() {
      return userRepository.getUser();
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
}
