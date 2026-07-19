import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Scissors, Sparkles, ChevronRight, Crown } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export default function WelcomeScreen({ onGetStarted, onSignIn }: WelcomeScreenProps) {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      console.log("Get Started pressed");
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      console.log("Sign In pressed");
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

      <View style={styles.content}>
        {/* Top Section: Logo & Branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Crown size={22} color="#D4AF37" strokeWidth={1.5} />
          </View>
          <Text style={styles.logoText}>SALONPRO</Text>
          <Text style={styles.logoMotto}>EST. 2026</Text>
        </View>

        {/* Center Section: Hero Statement */}
        <View style={styles.heroContainer}>
          <View style={styles.accentOrnament}>
            <View style={styles.ornamentLine} />
            <Sparkles size={14} color="#D4AF37" style={styles.ornamentIcon} />
            <View style={styles.ornamentLine} />
          </View>

          <Text style={styles.heading}>Beauty{"\n"}Begins Here</Text>
          
          <Text style={styles.subtitle}>
            Book premium salon services in just a few taps.
          </Text>
        </View>

        {/* Bottom Section: Call to Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.8}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <View style={styles.buttonIconCircle}>
              <ChevronRight size={16} color="#000000" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignIn}
            activeOpacity={0.7}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account? <Text style={styles.signInHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fine Print Footer */}
        <View style={styles.footer}>
          <Scissors size={10} color="#52525B" />
          <Text style={styles.footerText}>EXPERIENCE PRESTIGE GROOMING</Text>
          <Scissors size={10} color="#52525B" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 24,
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
  logoContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.35)",
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 4,
    textAlign: "center",
  },
  logoMotto: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 3,
    marginTop: 4,
    opacity: 0.8,
  },
  heroContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
  },
  accentOrnament: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: 120,
    justifyContent: "center",
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(212, 175, 55, 0.3)",
  },
  ornamentIcon: {
    marginHorizontal: 8,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "300",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 16,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 24,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  actionContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#D4AF37",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 28,
    paddingRight: 8,
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
  buttonIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
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
  signInHighlight: {
    color: "#D4AF37",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  footerText: {
    color: "#52525B",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 2,
  },
});