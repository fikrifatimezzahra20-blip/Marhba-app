import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { LoginPayload, RegisterPayload, User } from "../types/auth.types";

export function useLogin() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      queryClient.setQueryData(["user-profile"], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      queryClient.setQueryData(["user-profile"], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      await authService.logout(refreshToken);
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

export function useUserProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const user = await authService.getMe();
      useAuthStore.setState({ user });
      return user;
    },
    enabled: Boolean(accessToken),
  });
}
