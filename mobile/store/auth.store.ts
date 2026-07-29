import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, User, LoginPayload, RegisterPayload } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { storage, zustandStorage } from "../utils/storage";

interface AuthActions {
  initAuth: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
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
          const accessToken = get().accessToken || (await storage.getAccessToken());
          const refreshToken = get().refreshToken || (await storage.getRefreshToken());
          const cachedUser = get().user || (await storage.getUserData());

          if (accessToken && refreshToken) {
            set({ accessToken, refreshToken, user: cachedUser });
            try {
              // Verify & fetch fresh profile from backend
              const currentUser = await authService.getMe();
              set({ user: currentUser });
              await storage.setUserData(currentUser);
            } catch (e) {
              const updatedToken = await storage.getAccessToken();
              if (!updatedToken) {
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

      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(payload);
          const { accessToken, refreshToken, user } = response;

          await storage.setAccessToken(accessToken);
          await storage.setRefreshToken(refreshToken);
          await storage.setUserData(user);

          set({
            user,
            accessToken,
            refreshToken,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Connexion échouée. Vérifiez vos identifiants.";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(payload);
          const { accessToken, refreshToken, user } = response;

          await storage.setAccessToken(accessToken);
          await storage.setRefreshToken(refreshToken);
          await storage.setUserData(user);

          set({
            user,
            accessToken,
            refreshToken,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Inscription échouée. Veuillez réessayer.";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        set({ isLoading: true });
        try {
          await authService.logout(refreshToken);
        } catch (e) {
          // ignore
        } finally {
          await storage.clearAuth();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
        }
      },

      fetchProfile: async () => {
        try {
          const user = await authService.getMe();
          set({ user });
          await storage.setUserData(user);
        } catch (e) {
          // error handled by api interceptor
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "marhba-auth-storage",
      storage: createJSONStorage(() => zustandStorage),
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
