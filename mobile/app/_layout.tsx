import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/auth.store";
import { colors } from "../theme/colors";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { isInitialized, accessToken, user, initAuth } = useAuthStore();

  // Initialize auth state on app launch
  useEffect(() => {
    initAuth();
  }, []);

  // Handle protected navigation guards
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    const isAuthenticated = Boolean(accessToken && user);

    if (!isAuthenticated && inAppGroup) {
      // Redirect to login if user is not authenticated and trying to access protected screens
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if user is already authenticated and on login/register screen
      router.replace("/home");
    }
  }, [isInitialized, accessToken, user, segments]);

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
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(app)/home" />
    </Stack>
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