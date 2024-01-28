import { useQuery } from '@tanstack/react-query';
import { UserRepository } from '../../../data/user-repository';

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
