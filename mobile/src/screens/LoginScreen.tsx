import React, { useState } from "react";
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

import { login } from "../services/authService";

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative Luxury Background Halos */}
      <View style={styles.backgroundDecoratorContainer} pointerEvents="none">
        <View style={styles.haloOuter} />
        <View style={styles.haloInner} />
        <View style={styles.goldLineLeft} />
        <View style={styles.goldLineRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header: Back Button & Logo Title */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.backButton}
                accessibilityLabel="Back"
              >
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>

              <View style={styles.miniBranding}>
                <Crown size={16} color="#D4AF37" strokeWidth={1.5} />
                <Text style={styles.miniBrandText}>SALONPRO</Text>
              </View>
              {/* Spacer to keep center alignment */}
              <View style={styles.backButtonSpacer} />
            </View>

            {/* Title Block */}
            <View style={styles.titleContainer}>
              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to access your bespoke grooming profile</Text>
            </View>

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
                    color={isEmailFocused ? "#D4AF37" : "#52525B"}
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
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
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
                    color={isPasswordFocused ? "#D4AF37" : "#52525B"}
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
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    activeOpacity={0.7}
                    style={styles.visibilityButton}
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={18} color="#A1A1AA" />
                    ) : (
                      <Eye size={18} color="#52525B" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Actions Block */}
            <View style={styles.actionContainer}>
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
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "android" ? 40 : 20,
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
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  miniBranding: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniBrandText: {
    color: "#FFFFFF",
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
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: -0.5,
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontStyle: "italic",
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  formContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 40,
  },
  inputWrapper: {
    width: "100%",
    gap: 8,
  },
  inputLabel: {
    color: "#A1A1AA",
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
    color: "#D4AF37",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  inputContainer: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: "#D4AF37",
    backgroundColor: "rgba(212, 175, 55, 0.02)",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
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
    marginTop: "auto",
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#D4AF37",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  signUpHighlight: {
    color: "#D4AF37",
    fontWeight: "600",
  },
});