import { UserRepository } from '../../data/user-repository';
import { useQuery, DefinedUseQueryResult } from '@tanstack/react-query';

const userRepository = new UserRepository();

type TQueryData = ReturnType<typeof userRepository.getUser>;

export function useUserQuery(): DefinedUseQueryResult<TQueryData>;
export function useUserQuery<T>(
  select: (data: TQueryData) => T
): DefinedUseQueryResult<T>;

export function useUserQuery<T>(select?: (data: TQueryData) => T) {
  return useQuery({
    queryKey: ['user'],
    queryFn() {
      return userRepository.getUser();
    },
    initialData() {
      return userRepository.getUser();
    },
    select,
  });
}
