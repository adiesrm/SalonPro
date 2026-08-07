import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  
  View,
} from 'react-native';
import {
  ArrowLeft,
  Crown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import LuxuryBackground from '../components/LuxuryBackground';
import { register } from '../services/authService';
import { createUserProfile } from '../services/firestoreService';
import { colors, theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  onBack?: () => void;
  onAccountCreated?: () => void;
  onSignInPress?: () => void;
}

export default function RegisterScreen({
  onBack,
  onAccountCreated,
  onSignInPress,
}: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const handleBack = () => {
    onBack?.();
  };

  const handleCreateAccount = async () => {
    const normalizedPhone = phone.replace(/\s|-/g, '');

    if (!fullName.trim()) {
      Alert.alert('Registration Failed', 'Full Name is required.');
      return;
    }

    if (!normalizedPhone) {
      Alert.alert('Registration Failed', 'Phone Number is required.');
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      Alert.alert('Registration Failed', 'Please enter a valid phone number.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Registration Failed', 'Email Address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Registration Failed', 'Please enter a valid email address.');
      return;
    }

    if (!password) {
      Alert.alert('Registration Failed', 'Password is required.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Registration Failed', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await register(fullName, email, password);

      await createUserProfile(
        userCredential.user.uid,
        fullName,
        email,
        normalizedPhone
      );

      Alert.alert(
        'Success',
        'Welcome to SalonPro! Your account has been created successfully.',
        [{ text: 'OK', onPress: () => onAccountCreated?.() }]
      );
    } catch (error: unknown) {
      console.log('Sign-up error:', error);

      const firebaseError = error as { code?: string; message?: string };
      let errorMessage = 'An unexpected error occurred during account registration.';

      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already associated with an account.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'The email address is formatted incorrectly.';
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'The password provided is too weak. Please use a stronger password.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }

      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <LuxuryBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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

              <View style={styles.backButtonSpacer} />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(100).duration(650)}
              style={styles.titleContainer}
            >
              <Text style={styles.heading}>Create Your Account</Text>
              <Text style={styles.subtitle}>
                Create your premium SalonPro account.
              </Text>
            </Animated.View>

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isFullNameFocused && styles.inputContainerFocused,
                  ]}
                >
                  <User
                    size={18}
                    color={isFullNameFocused ? colors.gold : colors.cocoaMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#52525B"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    onFocus={() => setIsFullNameFocused(true)}
                    onBlur={() => setIsFullNameFocused(false)}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isPhoneFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Phone
                    size={18}
                    color={isPhoneFocused ? colors.gold : colors.cocoaMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#52525B"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    onFocus={() => setIsPhoneFocused(true)}
                    onBlur={() => setIsPhoneFocused(false)}
                  />
                </View>
              </View>

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
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
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
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    autoCorrect={false}
                    spellCheck={false}
                    placeholder="Enter your password"
                    placeholderTextColor="#52525B"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible((visible) => !visible)}
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

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isConfirmPasswordFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Lock
                    size={18}
                    color={isConfirmPasswordFocused ? colors.gold : colors.cocoaMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    autoCorrect={false}
                    spellCheck={false}
                    placeholder="Confirm your password"
                    placeholderTextColor="#52525B"
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setIsConfirmPasswordVisible((visible) => !visible)
                    }
                    activeOpacity={0.7}
                    style={styles.visibilityButton}
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOff size={18} color={colors.cocoaMuted} />
                    ) : (
                      <Eye size={18} color={colors.cocoaMuted} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={handleCreateAccount}
                activeOpacity={0.8}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSignInPress}
                activeOpacity={0.7}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account?{' '}
                  <Text style={styles.signUpHighlight}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.blush },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 36,
    zIndex: 10,
  },
  backgroundDecoratorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    overflow: 'hidden',
  },
  haloOuter: { position: 'absolute', width: width * 1.5, height: width * 1.5, borderRadius: (width * 1.5) / 2, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.04)', top: -width * 0.4 },
  haloInner: { position: 'absolute', width: width * 0.9, height: width * 0.9, borderRadius: (width * 0.9) / 2, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.08)', top: height * 0.15 },
  goldLineLeft: { position: 'absolute', width: 1, height: '100%', backgroundColor: 'rgba(212, 175, 55, 0.03)', left: 40 },
  goldLineRight: { position: 'absolute', width: 1, height: '100%', backgroundColor: 'rgba(212, 175, 55, 0.03)', right: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 8 },
  backButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.whiteGlass, backgroundColor: colors.ivoryGlass, alignItems: 'center', justifyContent: 'center' },
  miniBranding: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniBrandText: { color: colors.ink, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  backButtonSpacer: { width: 44 },
  titleContainer: { marginTop: 40, marginBottom: 32, width: '100%', paddingHorizontal: 22, paddingVertical: 28, borderRadius: 34, backgroundColor: colors.ivoryGlass, borderWidth: 1, borderColor: colors.whiteGlass, ...theme.shadows.glass },
  heading: { color: colors.ink, fontSize: 32, fontWeight: '300', letterSpacing: -0.5, marginBottom: 10, fontFamily: theme.typography.displayFont, fontStyle: 'italic' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0.2 },
  formContainer: { width: '100%', gap: 20, marginBottom: 40, padding: 18, borderRadius: 30, backgroundColor: colors.ivoryGlass, borderWidth: 1, borderColor: colors.whiteGlass, ...theme.shadows.glass },
  inputWrapper: { width: '100%', gap: 8 },
  inputLabel: { color: colors.cocoaSoft, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.5 },
  inputContainer: { width: '100%', height: 56, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255, 255, 255, 0.36)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inputContainerFocused: { borderColor: colors.gold, backgroundColor: 'rgba(255, 250, 244, 0.72)', shadowColor: colors.gold, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6 },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, height: '100%', color: colors.ink, fontSize: 14, letterSpacing: 0.3 },
  visibilityButton: { padding: 4 },
  actionContainer: { width: '100%', alignItems: 'center', gap: 16, marginTop: 'auto' },
  primaryButton: { width: '100%', height: 56, backgroundColor: colors.cocoa, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: colors.cocoa, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 6 },
  primaryButtonText: { color: colors.cream, fontSize: 16, fontWeight: '600', letterSpacing: 1 },
  secondaryButton: { paddingVertical: 12 },
  secondaryButtonText: { color: colors.cocoaSoft, fontSize: 13, fontWeight: '400', letterSpacing: 0.3 },
  signUpHighlight: { color: colors.ink, fontWeight: '600' },
});
