import React from 'react';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserRepository } from '~/data/user/user.repository';

const options = queryOptions({
  queryKey: ['user'],
  queryFn: () => getUserRepository().getUser(),
  gcTime: Infinity,
  staleTime: Infinity,
});

export function useOptionalUserQuery() {
  return useQuery(options);
}

export function useCurrentUser() {
  const { data } = useOptionalUserQuery();
  const queryClient = useQueryClient();

  // Mantém o estado anterior para evitar erro durante a transição de logout
  const previousState = React.useRef(data);
  React.useEffect(() => {
    previousState.current = queryClient.getQueryData(options.queryKey);
  }, [data]);
  const user = data ?? previousState.current;

  if (!user) {
    throw new Error(
      'Não é possível acessar os dados do usuário sem estar logado',
    );
  }
  return user;
}

export function useIsAuthenticated() {
  const userQuery = useOptionalUserQuery();
  const isAuthenticated = !!userQuery.data;
  return isAuthenticated;
}

export function useIsUnauthenticated() {
  const userQuery = useOptionalUserQuery();
  const isAuthenticated = !!userQuery.data;
  return !isAuthenticated;
}
