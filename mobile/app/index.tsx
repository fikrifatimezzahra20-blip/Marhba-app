import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth.store";
import { colors } from "../theme/colors";

export default function Index() {
  const router = useRouter();
  const { isInitialized, accessToken, user } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (accessToken && user) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isInitialized, accessToken, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});