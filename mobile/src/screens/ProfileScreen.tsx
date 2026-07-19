import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { ArrowLeft } from "lucide-react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // adjust path to your firebase config
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
// ─── Types ────────────────────────────────────────────────────────────────────



// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns up to 2 uppercase initials derived from the display name or email. */
function getInitials(name: string | null, email: string | null): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (email && email.trim().length > 0) {
    return email[0].toUpperCase();
  }
  return "S";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SettingsRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

function SettingsRow({ icon, label, onPress, isLast = false }: SettingsRowProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.settingsRow,
        isLast && styles.settingsRowLast,
        pressed && styles.settingsRowPressed,
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={1}
    >
      <View style={styles.settingsRowLeft}>
        <View style={styles.settingsIconWrap}>
          <Text style={styles.settingsIcon}>{icon}</Text>
        </View>
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <Text style={styles.settingsChevron}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [signingOut, setSigningOut] = useState(false);

  const user = auth.currentUser;
  const displayName = user?.displayName ?? null;
  const email = user?.email ?? null;
  const name = displayName ?? "SalonPro User";
  const initials = getInitials(displayName, email);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of SalonPro?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              setSigningOut(true);
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
              });
            } catch (error: unknown) {
              setSigningOut(false);
              const message =
                error instanceof Error
                  ? error.message
                  : "Something went wrong. Please try again.";
              Alert.alert("Log Out Failed", message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation]);

  const handlePrivacyPolicy = useCallback(() => {
    // TODO: navigate to Privacy Policy screen or open URL
    Alert.alert("Privacy Policy", "Privacy Policy screen coming soon.");
  }, []);

  const handleTerms = useCallback(() => {
    // TODO: navigate to Terms screen or open URL
    Alert.alert("Terms & Conditions", "Terms & Conditions screen coming soon.");
  }, []);

  const handleAbout = useCallback(() => {
    // TODO: navigate to About screen
    Alert.alert("About SalonPro", "Version 1.0.0\nBuilt with ❤️ for salon professionals.");
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Full-screen loading overlay while signing out */}
      {signingOut && (
        <View style={styles.loadingOverlay} pointerEvents="box-only">
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Signing out…</Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.headerBackButton}
            accessibilityLabel="Back"
          >
            <ArrowLeft size={22} color={COLORS.text} strokeWidth={1.8} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerBackButtonSpacer} />
        </View>

        {/* ── Profile Card ──────────────────────────────── */}
        <View style={styles.card}>
          {/* Decorative top gradient band */}
          <View style={styles.cardBand} />

          <View style={styles.cardBody}>
            {/* Avatar */}
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            </View>

            {/* Name */}
            <Text style={styles.userName} numberOfLines={1} adjustsFontSizeToFit>
              {name}
            </Text>

            {/* Email badge */}
            {email ? (
              <View style={styles.emailBadge}>
                <Text style={styles.emailIcon}>✉</Text>
                <Text style={styles.emailText} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            ) : (
              <Text style={styles.noEmailText}>No email on file</Text>
            )}

            {/* Divider */}
            <View style={styles.cardDivider} />

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>✦</Text>
                <Text style={styles.statLabel}>Premium</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Active</Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Settings Section ──────────────────────────── */}
        <Text style={styles.sectionHeading}>Legal & Info</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="🔒"
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon="📋"
            label="Terms & Conditions"
            onPress={handleTerms}
          />
          <SettingsRow
            icon="ℹ️"
            label="About SalonPro"
            onPress={handleAbout}
            isLast
          />
        </View>

        {/* ── Log Out Button ────────────────────────────── */}
        <TouchableOpacity
          style={[styles.logoutButton, signingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={signingOut}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Log Out"
        >
          {signingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.logoutIcon}>⎋</Text>
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.version}>SalonPro v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  bg: "#0F0F14",
  surface: "#1A1A24",
  surfaceHigh: "#22222F",
  border: "#2E2E3D",
  accent: "#C8A96E",          // warm champagne gold
  accentDeep: "#A0814B",
  accentGlow: "rgba(200,169,110,0.18)",
  text: "#F2EFE9",
  textMuted: "#8A8499",
  textDim: "#5C5870",
  danger: "#E05252",
  dangerDeep: "#B83C3C",
  dangerGlow: "rgba(224,82,82,0.15)",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.65)",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Loading overlay ──
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 16,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Scroll ──
  scroll: {
    paddingBottom: 48,
    paddingHorizontal: 20,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackButtonSpacer: {
    width: 44,
  },

  // ── Profile Card ──
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  cardBand: {
    height: 6,
    backgroundColor: COLORS.accent,
    // React Native doesn't support gradient natively without expo-linear-gradient,
    // so we use a solid accent color band as an elegant accent line.
  },
  cardBody: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },

  // Avatar
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.accentGlow,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: 1,
  },

  // Name / email
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  emailIcon: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  emailText: {
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },
  noEmailText: {
    fontSize: 13,
    color: COLORS.textDim,
    fontStyle: "italic",
  },

  // Divider & stats
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    alignSelf: "stretch",
    marginVertical: 24,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // ── Section heading ──
  sectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDim,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },

  // ── Settings card ──
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsRowPressed: {
    backgroundColor: COLORS.surfaceHigh,
  },
  settingsRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  settingsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceHigh,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsIcon: {
    fontSize: 16,
  },
  settingsLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  settingsChevron: {
    fontSize: 22,
    color: COLORS.textDim,
    fontWeight: "300",
    lineHeight: 26,
  },

  // ── Log Out button ──
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.danger,
    borderRadius: 18,
    paddingVertical: 17,
    gap: 10,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.4,
  },

  // ── Footer version ──
  version: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textDim,
    letterSpacing: 0.5,
  },
});
