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
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegister } from "../../hooks/useAuthQueries";
import { useAuthStore } from "../../store/auth.store";
import { colors, spacing, typography } from "../../theme";

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { clearError } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = () => {
    setLocalError(null);
    clearError();

    // Validations
    if (!fullName.trim()) {
      setLocalError("Veuillez saisir votre nom complet.");
      return;
    }
    if (!email.trim()) {
      setLocalError("Veuillez saisir votre adresse email.");
      return;
    }
    if (!password) {
      setLocalError("Veuillez saisir votre mot de passe.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }

    registerMutation.mutate(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          router.replace("/home");
        },
      }
    );
  };

  const mutationError = registerMutation.error
    ? (registerMutation.error as any).response?.data?.error ||
    (registerMutation.error as any).response?.data?.message ||
    "Inscription échouée. Veuillez réessayer."
    : null;

  const activeError = localError || mutationError;
  const isLoading = registerMutation.isPending;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo Header */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.phoenixLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Marhba</Text>
            <Text style={styles.headline}>Create Account</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {activeError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={styles.errorText}>{activeError}</Text>
              </View>
            ) : null}

            {/* Full Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="enter your full name"
                  placeholderTextColor="#666666"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (activeError) setLocalError(null);
                  }}
                  autoCapitalize="words"
                />
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#A0A0A0"
                  style={styles.inputIconRight}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="enter your email"
                  placeholderTextColor="#666666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (activeError) setLocalError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="#A0A0A0"
                  style={styles.inputIconRight}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="enter your password"
                  placeholderTextColor="#666666"
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
                  style={styles.inputIconRight}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      showPassword ? "eye-off-outline" : "lock-closed-outline"
                    }
                    size={22}
                    color="#A0A0A0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="confirm your password"
                  placeholderTextColor="#666666"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (activeError) setLocalError(null);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.inputIconRight}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? "eye-off-outline"
                        : "shield-checkmark-outline"
                    }
                    size={22}
                    color="#A0A0A0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button with Glowing Aura */}
            <View style={styles.buttonGlowContainer}>
              <View style={styles.ambientGlow} />

              <TouchableOpacity
                style={styles.loginButtonTouchable}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#FF8A00", "#FF5A1F"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>REGISTER</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Login Footer Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  clearError();
                  router.push("/login");
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.registerLink}>Login</Text>
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
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "android" ? 30 : 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 2,
  },
  phoenixLogo: {
    width: 200,
    height: 150,
    marginBottom: 2,
  },
  brandTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headline: {
    fontFamily: typography.fontFamily,
    fontSize: 30,
    fontWeight: typography.fontWeight.bold,
    color: "#FFFFFF",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: typography.fontWeight.regular,
    color: "#E5E2E1",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B1B1B",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#353534",
    paddingHorizontal: 16,
    height: 54,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    color: "#E5E2E1",
    height: "100%",
  },
  inputIconRight: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGlowContainer: {
    position: "relative",
    width: "100%",
    marginTop: 12,
    marginBottom: 32,
  },
  ambientGlow: {
    position: "absolute",
    top: 6,
    left: 12,
    right: 12,
    bottom: -6,
    backgroundColor: "#FF5A1F",
    borderRadius: 9999,
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowColor: "#FF5A1F",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.95,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
      web: {
        filter: "blur(14px)",
        boxShadow: "0px 10px 30px rgba(255, 90, 31, 0.7)",
      },
    }),
  },
  loginButtonTouchable: {
    borderRadius: 9999,
    overflow: "hidden",
  },
  gradientButton: {
    height: 56,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    color: "#E5E2E1",
    fontWeight: typography.fontWeight.regular,
  },
  registerLink: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: typography.fontWeight.bold,
    color: "#FFFFFF",
  },
});