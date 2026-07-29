import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLogin } from "../../hooks/useAuthQueries";
import { useAuthStore } from "../../store/auth.store";
import { colors, spacing, typography, shadows } from "../../theme";

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = () => {
    setLocalError(null);
    clearError();

    // Basic Validation
    if (!email.trim()) {
      setLocalError("Veuillez saisir votre adresse email.");
      return;
    }
    if (!password) {
      setLocalError("Veuillez saisir votre mot de passe.");
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          router.replace("/home");
        },
      }
    );
  };

  const mutationError = loginMutation.error
    ? (loginMutation.error as any).response?.data?.error ||
      (loginMutation.error as any).response?.data?.message ||
      "Connexion échouée. Vérifiez vos identifiants."
    : null;

  const activeError = localError || mutationError;
  const isLoading = loginMutation.isPending;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="sparkles" size={36} color={colors.primary} />
            </View>
            <Text style={styles.brandTitle}>Marhba</Text>
            <Text style={styles.subtitle}>
              Bienvenue ! Connectez-vous à votre compte.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {activeError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={styles.errorText}>{activeError}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="votre.email@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (activeError) setLocalError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (activeError) setLocalError(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textLight} />
              ) : (
                <Text style={styles.submitButtonText}>Se Connecter</Text>
              )}
            </TouchableOpacity>

            {/* Link to Register */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>{"Vous n'avez pas de compte ?"}</Text>
              <TouchableOpacity
                onPress={() => {
                  clearError();
                  router.push("/register");
                }}
              >
                <Text style={styles.registerLink}>{" S'inscrire"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: spacing.borderRadius.xl,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  brandTitle: {
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    height: "100%",
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    ...shadows.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});