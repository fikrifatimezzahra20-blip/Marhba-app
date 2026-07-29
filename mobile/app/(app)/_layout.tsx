import { Stack } from "expo-router";
import { useAuthStore } from "../../store/auth.store";

export default function AppLayout() {
  const { accessToken, user, isInitialized } = useAuthStore();
  const isAuthenticated = Boolean(accessToken && user);

  if (!isInitialized) return null;

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="home" />
      </Stack.Protected>
    </Stack>
  );
}
