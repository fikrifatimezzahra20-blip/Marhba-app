import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, User, LoginPayload, RegisterPayload } from "../types/auth.types";
import { authService } from "../services/auth.service";

interface AuthActions {
  initAuth: () => Promise<void>;
  setAuth: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      initAuth: async () => {
        try {
          set({ isLoading: true });
          const { accessToken, refreshToken } = get();

          if (accessToken && refreshToken) {
            try {
              // Verify & fetch fresh profile from backend
              const currentUser = await authService.getMe();
              set({ user: currentUser });
            } catch (e) {
              const currentToken = get().accessToken;
              if (!currentToken) {
                set({ user: null, accessToken: null, refreshToken: null });
              }
            }
          } else {
            set({ user: null, accessToken: null, refreshToken: null });
          }
        } catch (err: any) {
          set({ user: null, accessToken: null, refreshToken: null });
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      setAuth: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken, error: null });
      },

      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null, error: null });
      },

      fetchProfile: async () => {
        try {
          const user = await authService.getMe();
          set({ user });
        } catch (e) {
          // error handled by api interceptor
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "marhba-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initAuth();
        }
      },
    }
  )
);
