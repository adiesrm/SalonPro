import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Crown } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import LuxuryBackground from "../components/LuxuryBackground";
import { login } from "../services/authService";
import { colors, theme } from "../theme/theme";

const { width, height } = Dimensions.get("window");

interface LoginScreenProps {
  onBack?: () => void;
  onSignIn?: (credentials: { email: string; password?: string }) => void;
  onCreateAccount?: () => void;
}

export default function LoginScreen({ onBack, onSignIn, onCreateAccount }: LoginScreenProps) {
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // ...other useState hooks...
  
   

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log("Back pressed");
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Authentication Failed", "Please enter both your email address and password.");
      return;
    }
    try {
      await login(email, password);
      if (onSignIn) {
        onSignIn({ email, password });
      } else {
        console.log("Signed in successfully via Firebase");
      }
    } catch (error: any) {
      console.log("Sign-in error:", error);
      let errorMessage = "An unexpected error occurred during authentication.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please verify your luxury credentials.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is formatted incorrectly.";
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Access has been temporarily restricted for security.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert("Authentication Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LuxuryBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={false}
        >
            {/* Header: Back Button & Logo Title */}
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={styles.header}
            >
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.backButton}
                accessibilityLabel="Back"
              >
                <ArrowLeft size={22} color={colors.cocoa} strokeWidth={1.5} />
              </TouchableOpacity>

              <View style={styles.miniBranding}>
                <Crown size={16} color={colors.gold} strokeWidth={1.5} />
                <Text style={styles.miniBrandText}>SALONPRO</Text>
              </View>
              {/* Spacer to keep center alignment */}
              <View style={styles.backButtonSpacer} />
            </Animated.View>

            {/* Title Block */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(650)}
              style={styles.titleContainer}
            >
              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to access your bespoke grooming profile</Text>
            </Animated.View>

            {/* Input Form Fields */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isEmailFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Mail
                    size={18}
                    color={isEmailFocused ? colors.gold : colors.cocoaMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
  style={styles.textInput}
  placeholder="Enter your email"
  placeholderTextColor="#52525B"
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
  keyboardType="email-address"
  autoComplete="email"

  onFocus={() => {
    
    setIsEmailFocused(true);
  }}

  onBlur={() => {
    
    setIsEmailFocused(false);
  }}
/>
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    isPasswordFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Lock
                    size={18}
                    color={isPasswordFocused ? colors.gold : colors.cocoaMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
  style={styles.textInput}
  placeholder="Enter your password"
  placeholderTextColor="#52525B"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={!isPasswordVisible}
  autoCapitalize="none"
  autoComplete="password"
  onFocus={() => {
    
    setIsPasswordFocused(true);
  }}
  onBlur={()  => {
     
    setIsPasswordFocused(false);
  }}  
/>                  
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    activeOpacity={0.7}
                    style={styles.visibilityButton}
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={18} color={colors.cocoaMuted} />
                    ) : (
                      <Eye size={18} color={colors.cocoaMuted} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Actions Block */}
            <Animated.View
              entering={FadeInUp.delay(260).duration(650)}
              style={styles.actionContainer}
            >
              <TouchableOpacity
                onPress={handleSignIn}
                activeOpacity={0.8}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onCreateAccount?.()}
                activeOpacity={0.7}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>
                  Don't have an account?{" "}
                  <Text style={styles.signUpHighlight}>Create Account</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blush,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 54 : 40,
    paddingBottom: 36,
    zIndex: 10,
  },
  backgroundDecoratorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    overflow: "hidden",
  },
  haloOuter: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.04)",
    top: -width * 0.4,
  },
  haloInner: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.08)",
    top: height * 0.15,
  },
  goldLineLeft: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.03)",
    left: 40,
  },
  goldLineRight: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.03)",
    right: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
    alignItems: "center",
    justifyContent: "center",
  },
  miniBranding: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniBrandText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  backButtonSpacer: {
    width: 44,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 32,
    width: "100%",
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderRadius: 34,
    backgroundColor: colors.ivoryGlass,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    ...theme.shadows.glass,
  },
  heading: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: -0.5,
    marginBottom: 10,
    fontFamily: theme.typography.displayFont,
    fontStyle: "italic",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  formContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 40,
    padding: 18,
    borderRadius: 30,
    backgroundColor: colors.ivoryGlass,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    ...theme.shadows.glass,
  },
  inputWrapper: {
    width: "100%",
    gap: 8,
  },
  inputLabel: {
    color: colors.cocoaSoft,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotPasswordText: {
    color: colors.cocoa,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  inputContainer: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255, 255, 255, 0.36)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: colors.gold,
    backgroundColor: "rgba(255, 250, 244, 0.85)",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: colors.ink,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  visibilityButton: {
    padding: 4,
  },
  actionContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
    marginTop: 24,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: colors.cocoa,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.cocoa,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.cocoaSoft,
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  signUpHighlight: {
    color: colors.ink,
    fontWeight: "600",
  },
});
