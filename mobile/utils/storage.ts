import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { StateStorage } from "zustand/middleware";

const ACCESS_TOKEN_KEY = "marhba_access_token";
const REFRESH_TOKEN_KEY = "marhba_refresh_token";
const USER_KEY = "marhba_user_data";

// Custom StateStorage adapter for Zustand persist middleware
export const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    }
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        console.error("Error setting localStorage item", e);
      }
      return;
    }
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(name);
      } catch (e) {
        console.error("Error removing localStorage item", e);
      }
      return;
    }
    await SecureStore.deleteItemAsync(name);
  },
};

export const storage = {
  async setAccessToken(token: string): Promise<void> {
    await zustandStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken(): Promise<string | null> {
    return await zustandStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    await zustandStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await zustandStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async setUserData(user: any): Promise<void> {
    const dataStr = JSON.stringify(user);
    await zustandStorage.setItem(USER_KEY, dataStr);
  },

  async getUserData(): Promise<any | null> {
    const dataStr = await zustandStorage.getItem(USER_KEY);
    if (!dataStr) return null;
    try {
      return JSON.parse(dataStr);
    } catch {
      return null;
    }
  },

  async clearAuth(): Promise<void> {
    await zustandStorage.removeItem(ACCESS_TOKEN_KEY);
    await zustandStorage.removeItem(REFRESH_TOKEN_KEY);
    await zustandStorage.removeItem(USER_KEY);
    await zustandStorage.removeItem("marhba-auth-storage");
  },
};
