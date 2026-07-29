import { api } from "./api";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
} from "../types/auth.types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  async logout(refreshToken?: string | null): Promise<void> {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (e) {
      // Ignore network failures on logout
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};
