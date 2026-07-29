import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";
import { useAuthStore } from "../store/auth.store";
import { colors } from "../theme/colors";

export default function RootLayout() {
  const { isInitialized, accessToken, user, initAuth } = useAuthStore();
  const isAuthenticated = Boolean(accessToken && user);

  // Initialize auth state on app launch
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Render smooth splash / loading screen while checking initial auth status
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement de Marhba...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});