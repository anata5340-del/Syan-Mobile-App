import { useRefreshStore } from '../stores/refresh.store';

export const useRefreshHandler = (onRefresh: () => Promise<void>) => {
  const { isRefreshing, setRefreshing } = useRefreshStore();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return { isRefreshing, handleRefresh };
};

export const getRefreshState = () => {
  const { isRefreshing } = useRefreshStore.getState();
  return isRefreshing;
};
