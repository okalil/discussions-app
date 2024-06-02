import React from 'react';
import { Toast } from '../toast';

export function useRefresh(refresh: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      Toast.show('Erro ao atualizar', Toast.LONG);
    } finally {
      setRefreshing(false);
    }
  };
  return { refreshing, onRefresh };
}
