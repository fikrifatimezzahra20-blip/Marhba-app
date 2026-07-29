import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryStorage = new Map<string, string>();

export const appStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn(`[storage] getItem error for key "${key}", falling back to memory:`, e);
      return memoryStorage.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[storage] setItem error for key "${key}", falling back to memory:`, e);
      memoryStorage.set(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] removeItem error for key "${key}":`, e);
      memoryStorage.delete(key);
    }
  },
  clear: async (): Promise<void> => {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
        return;
      }
      await AsyncStorage.clear();
    } catch (e) {
      console.warn("[storage] clear error:", e);
      memoryStorage.clear();
    }
  },
};

