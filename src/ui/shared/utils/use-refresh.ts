import React from 'react';
import { Toast } from '../toast';

export function useRefresh(refresh: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    try {
      setRefreshing(true)

      // Se o refresh() resolver em menos de 1.5s, forçamos um delay para completar 1.5s
      // O propósito é evitar "flicker" do loading desaparecendo muito rápido
      const minDelayPromise = new Promise(r => setTimeout(r, 1_500))
      await refresh();
      await minDelayPromise
    } catch (error) {
      Toast.show('Erro ao atualizar', Toast.LONG);
    } finally {
      setRefreshing(false);
    }
  };
  return { refreshing, onRefresh };
}
