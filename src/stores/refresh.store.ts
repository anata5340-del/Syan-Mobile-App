import { create } from 'zustand';

interface RefreshStore {
  isRefreshing: boolean;
  setRefreshing: (state: boolean) => void;
}

export const useRefreshStore = create<RefreshStore>((set) => ({
  isRefreshing: false,
  setRefreshing: (state: boolean) => set({ isRefreshing: state }),
}));
