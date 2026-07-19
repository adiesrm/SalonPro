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
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Crown, User } from "lucide-react-native";
import { createUserProfile } from "../services/firestoreService";
import { register } from "../services/authService";
const { width, height } = Dimensions.get("window");
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
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [isPasswordVisible, setIsPasswordVisible] = useState(false);
const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
const [isFullNameFocused, setIsFullNameFocused] = useState(false);
const [isEmailFocused, setIsEmailFocused] = useState(false);
const [isPasswordFocused, setIsPasswordFocused] = useState(false);
const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
const handleBack = () => {
if (onBack) {
onBack();
} else {
console.log("Back pressed");
}
};
const handleCreateAccount = async () => {
if (!fullName.trim()) {
Alert.alert("Registration Failed", "Full Name is required.");
return;
}
if (!email.trim()) {
Alert.alert("Registration Failed", "Email Address is required.");
return;
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email.trim())) {
Alert.alert("Registration Failed", "Please enter a valid email address.");
return;
}
if (!password) {
Alert.alert("Registration Failed", "Password is required.");
return;
}
if (password.length < 6) {
Alert.alert("Registration Failed", "Password must be at least 6 characters.");
return;
}
if (password !== confirmPassword) {
Alert.alert("Registration Failed", "Passwords do not match.");
return;
}
try {
  const userCredential = await register(fullName, email, password);

await createUserProfile(
  userCredential.user.uid,
  fullName,
  email
);
  Alert.alert(
    "Success",
    "Welcome to SalonPro! Your account has been created successfully.",
    [
      {
        text: "OK",
        onPress: () => {
          onAccountCreated?.();
        },
      },
    ]
  );
} catch (error: any) { //show error alert 
  console.log("Sign-up error:", error);
  let errorMessage = "An unexpected error occurred during account registration.";
  if (error.code === "auth/email-already-in-use") {
    errorMessage = "This email address is already associated with an account.";
  } else if (error.code === "auth/invalid-email") {
    errorMessage = "The email address is formatted incorrectly.";
  } else if (error.code === "auth/weak-password") {
    errorMessage = "The password provided is too weak. Please use a stronger password.";
  } else if (error.message) {
    errorMessage = error.message;
  }
  Alert.alert("Registration Failed", errorMessage);
}
};
const handleSignInPress = () => {
onSignInPress?.();
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
          <Text style={styles.heading}>Create Your Account</Text>
          <Text style={styles.subtitle}>Create your premium SalonPro account.</Text>
        </View>

        {/* Input Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name Input */}
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
                color={isFullNameFocused ? "#D4AF37" : "#52525B"}
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
            <Text style={styles.inputLabel}>Password</Text>
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
           value={password}
           onChangeText={setPassword}
           secureTextEntry={!isPasswordVisible}
           autoCapitalize="none"
           autoComplete="new-password"
           textContentType="newPassword"
           autoCorrect={false}
           spellCheck={false}
           placeholder="Confirm your password"
           placeholderTextColor="#52525B"
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

          {/* Confirm Password Input */}
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
                color={isConfirmPasswordFocused ? "#D4AF37" : "#52525B"}
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
             placeholder="Enter your password"
             placeholderTextColor="#52525B"
             onFocus={() => setIsConfirmPasswordFocused(true)}
             onBlur={() => setIsConfirmPasswordFocused(false)}
            />
              <TouchableOpacity
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                activeOpacity={0.7}
                style={styles.visibilityButton}
              >
                {isConfirmPasswordVisible ? (
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
            onPress={handleCreateAccount}
            activeOpacity={0.8}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignInPress}
            activeOpacity={0.7}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account?{" "}
              <Text style={styles.signUpHighlight}>Sign In</Text>
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