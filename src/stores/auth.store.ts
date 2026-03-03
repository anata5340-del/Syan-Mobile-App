import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../api/auth.service';
import { setToken, removeToken, getToken } from '../utils/token';
import { isTokenExpired } from '../utils/tokenUtils';
import type { User } from '../types/api';
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  isRefreshing: boolean;
  userCredentials: { email: string; password: string } | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAndRefreshToken: () => Promise<boolean>;
  setUserCredentials: (email: string, password: string) => void;
  clearUserCredentials: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      loading: false,
      isRefreshing: false,
      userCredentials: null,

      login: async (email: string, password: string) => {
        set({ loading: true });

        try {
          const { user, token } = await loginApi({ email, password });
          await setToken(token);

          set({
            user,
            isLoggedIn: true,
            loading: false,
            userCredentials: { email, password },
          });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await logoutApi();
        } catch (error) {
          // Silent fail
        }

        await removeToken();

        set({
          user: null,
          isLoggedIn: false,
          userCredentials: null,
          isRefreshing: false,
        });
      },

      checkAndRefreshToken: async (): Promise<boolean> => {
        const state = get();
        
        if (state.isRefreshing) {
          console.log(' Refresh already in progress');
          return false;
        }

        try {
          set({ isRefreshing: true });

          const token = await getToken();
          
          if (!token) {
            console.log('[Auth] No token found, logging out');
            set({ isRefreshing: false });
            await get().logout();
            return false;
          }

          if (isTokenExpired(token, 5)) {
            console.log(' Token expired, attempting refresh...');
            
            const credentials = state.userCredentials;
            
            if (credentials?.email && credentials?.password) {
              try {
                const { user, token: newToken } = await loginApi({
                  email: credentials.email,
                  password: credentials.password,
                });
                
                if (newToken) {
                  await setToken(newToken);
                  set({ 
                    user,
                    isLoggedIn: true,
                    isRefreshing: false,
                  });
                  console.log(' Token refreshed successfully');
                  return true;
                }
              } catch (refreshError) {
                console.log(' Token refresh failed:', refreshError);
                set({ isRefreshing: false });
                await get().logout();
                return false;
              }
            } else {
              console.log('[Auth] No credentials stored, logging out');
              set({ isRefreshing: false });
              await get().logout();
              return false;
            }
          } else {
            console.log(' Token is valid');
            set({ isRefreshing: false });
            return true;
          }

          set({ isRefreshing: false });
          return false;
        } catch (error) {
          console.log('[Auth] Token check error:', error);
          set({ isRefreshing: false });
          await get().logout();
          return false;
        }
      },

      setUserCredentials: (email: string, password: string) => {
        set({ userCredentials: { email, password } });
      },

      clearUserCredentials: () => {
        set({ userCredentials: null });
      },

      setUser: (user: User | null) => set({ user }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        userCredentials: state.userCredentials,
      }),
    }
  )
);