import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/auth.store";
import { colors, spacing, typography, shadows } from "../../theme";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "M";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar Header */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.miniLogoBadge}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <Text style={styles.brandName}>Marhba</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutIconButton}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeader}>
            <Text style={styles.welcomeSubtitle}>BIENVENUE SUR MARHBA 👋</Text>
            <Text style={styles.heroTitle}>
              Bonjour, {user?.fullName || "Utilisateur"} !
            </Text>
            <Text style={styles.heroDescription}>
              Ravi de vous revoir. Votre espace personnel est entièrement sécurisé et protégé.
            </Text>
          </View>
        </View>

        {/* User Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Profil Utilisateur</Text>
          </View>

          <View style={styles.profileContent}>
            {/* Avatar Badge */}
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
            </View>

            {/* Profile Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={16} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Nom :</Text>
                <Text style={styles.detailValue}>{user?.fullName || "N/A"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="mail" size={16} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Email :</Text>
                <Text style={styles.detailValue}>{user?.email || "N/A"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="key" size={16} color={colors.textMuted} />
                <Text style={styles.detailLabel}>ID Utilisateur :</Text>
                <Text style={styles.detailValue}>#{user?.id || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security & Protection Badge */}
        <View style={styles.protectionCard}>
          <View style={styles.protectionIconContainer}>
            <Ionicons name="shield-checkmark" size={32} color={colors.success} />
          </View>
          <View style={styles.protectionTextContainer}>
            <Text style={styles.protectionTitle}>Session Protégée</Text>
            <Text style={styles.protectionDescription}>
              Cette page est accessible uniquement aux utilisateurs authentifiés avec JWT et Refresh Token.
            </Text>
          </View>
        </View>

        {/* Features / Quick Actions */}
        <View style={styles.gridContainer}>
          <View style={styles.gridCard}>
            <Ionicons name="pulse" size={28} color={colors.secondaryDark} />
            <Text style={styles.gridCardTitle}>Statut Compte</Text>
            <Text style={styles.gridCardSubtitle}>Actif & Vérifié</Text>
          </View>

          <View style={styles.gridCard}>
            <Ionicons name="options" size={28} color={colors.primary} />
            <Text style={styles.gridCardTitle}>Paramètres</Text>
            <Text style={styles.gridCardSubtitle}>Gérer le profil</Text>
          </View>
        </View>

        {/* Main Logout Action Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.error} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  miniLogoBadge: {
    width: 36,
    height: 36,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  logoutIconButton: {
    padding: spacing.xs,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.errorBg,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  heroHeader: {},
  welcomeSubtitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.secondaryLight,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  heroDescription: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.88)",
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: spacing.borderRadius.round,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  detailsContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
    flexShrink: 1,
  },
  protectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successBg,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    gap: spacing.md,
  },
  protectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  protectionTextContainer: {
    flex: 1,
  },
  protectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  protectionDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  gridCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  gridCardSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.errorBg,
    borderRadius: spacing.borderRadius.md,
    height: 50,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});