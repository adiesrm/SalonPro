import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  Clock,
  Sparkles,
  Check,
  ShieldCheck,
  Crown,
  Scissors,
} from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import LuxuryBackground from "../components/LuxuryBackground";
import { colors, theme } from "../theme/theme";

const { width, height } = Dimensions.get("window");

interface ServiceDetailsScreenProps {
  onBack?: () => void;
  onBookNow?: () => void;
  service?: {
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
    whatsIncluded: string[];
  };
}

export default function ServiceDetailsScreen({
  onBack,
  onBookNow,
  service,
}: ServiceDetailsScreenProps) {
  // Fallback premium default service details if none provided
  const serviceDetails = service || {
    name: "The Royal Grooming Ritual",
    category: "Signature Experience",
    price: "₹2,499",
    duration: "75 min",
    description:
      "Our ultimate signature experience crafted for the modern gentleman. This curated ritual includes a precision bespoke haircut tailored to your features, followed by an artisanal hot towel shave with infused botanical essential oils, a detoxifying charcoal facial massage, and an revitalizing hair spa treatment.",
    whatsIncluded: [
      "Bespoke precision haircut & custom styling design",
      "Traditional hot towel wet shave with premium pre-shave elixir",
      "Detoxifying facial massage & revitalizing scalp therapy",
    ],
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      console.log("Back pressed");
    }
  };

  const handleBookNowPress = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      console.log("Book Now pressed for:", serviceDetails.name);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <LuxuryBackground />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={colors.cocoa} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Service Image Placeholder */}
        <Animated.View
          entering={FadeInUp.duration(650)}
          style={styles.imagePlaceholderContainer}
        >
          <View style={styles.imageInnerBorder}>
            <Crown size={48} color={colors.gold} strokeWidth={1.2} style={styles.imageIcon} />
            <Text style={styles.imagePlaceholderText}>SALON PRO EXPO</Text>
            <Text style={styles.imagePlaceholderSubtext}>L'EXPERIENCE PRESTIGE</Text>
            <View style={styles.goldCornerTopLeft} />
            <View style={styles.goldCornerTopRight} />
            <View style={styles.goldCornerBottomLeft} />
            <View style={styles.goldCornerBottomRight} />
          </View>
        </Animated.View>

        {/* Info Card Container */}
        <Animated.View
          entering={FadeInUp.delay(120).duration(650)}
          style={styles.detailsContainer}
        >
          {/* Category Tag */}
          <View style={styles.categoryBadge}>
            <Sparkles size={12} color={colors.gold} style={styles.badgeIcon} />
            <Text style={styles.categoryText}>{serviceDetails.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.serviceTitle}>{serviceDetails.name}</Text>

          {/* Metadata Row (Price & Duration) */}
          <View style={styles.metaRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>INVESTMENT</Text>
              <Text style={styles.priceValue}>{serviceDetails.price}</Text>
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.durationContainer}>
              <Text style={styles.durationLabel}>DURATION</Text>
              <View style={styles.durationValueRow}>
                <Clock size={16} color={colors.gold} style={styles.durationIcon} />
                <Text style={styles.durationValue}>{serviceDetails.duration}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descriptionHeader}>THE EXPERIENCE</Text>
          <Text style={styles.descriptionText}>{serviceDetails.description}</Text>

          {/* What's Included Section */}
          <Text style={styles.whatsIncludedHeader}>WHAT IS INCLUDED</Text>
          <View style={styles.bulletsContainer}>
            {serviceDetails.whatsIncluded.map((item, index) => (
              <View key={index} style={styles.bulletRow}>
                <View style={styles.bulletCheckCircle}>
                  <Check size={12} color={colors.cream} strokeWidth={3} />
                </View>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Quality Assurance Badge */}
          <View style={styles.assuranceCard}>
            <ShieldCheck size={18} color={colors.gold} strokeWidth={1.5} />
            <Text style={styles.assuranceText}>
              All rituals are performed using premium organic elixirs by master artisans.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Book Now Floating Bottom Button Container */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNowPress}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>BOOK NOW</Text>
          <Scissors size={18} color={colors.cream} strokeWidth={2} style={styles.bookIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blush,
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
    width: width * 1.6,
    height: width * 1.6,
    borderRadius: (width * 1.6) / 2,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.03)",
    top: -width * 0.3,
  },
  goldLineLeft: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.015)",
    left: 40,
  },
  goldLineRight: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.015)",
    right: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 44 : 20,
    height: Platform.OS === "android" ? 88 : 64,
    zIndex: 10,
    borderBottomWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: "rgba(255, 255, 255, 0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 120, // Padding to prevent floating bottom bar overlap
  },
  imagePlaceholderContainer: {
    marginHorizontal: 24,
    marginTop: 24,
    height: 240,
    borderRadius: 20,
    backgroundColor: colors.ivoryGlass,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    padding: 16,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInnerBorder: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageIcon: {
    marginBottom: 16,
  },
  imagePlaceholderText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 3,
    fontFamily: theme.typography.displayFont,
  },
  imagePlaceholderSubtext: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 6,
  },
  goldCornerTopLeft: {
    position: "absolute",
    top: -1,
    left: -1,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.gold,
  },
  goldCornerTopRight: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.gold,
  },
  goldCornerBottomLeft: {
    position: "absolute",
    bottom: -1,
    left: -1,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.gold,
  },
  goldCornerBottomRight: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.gold,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    marginTop: 28,
    zIndex: 10,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(205, 163, 90, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(205, 163, 90, 0.28)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeIcon: {
    marginRight: 6,
  },
  categoryText: {
    color: colors.cocoa,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  serviceTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: theme.typography.displayFont,
    lineHeight: 36,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.34)",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 28,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: colors.cocoaMuted,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  priceValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerLine: {
    width: 1,
    height: 40,
    backgroundColor: colors.line,
    marginHorizontal: 16,
  },
  durationContainer: {
    flex: 1,
  },
  durationLabel: {
    color: colors.cocoaMuted,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  durationValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationIcon: {
    marginRight: 6,
  },
  durationValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "600",
  },
  descriptionHeader: {
    color: colors.cocoaSoft,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  descriptionText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.2,
    marginBottom: 28,
  },
  whatsIncludedHeader: {
    color: colors.cocoaSoft,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  bulletsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.cocoa,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  assuranceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  assuranceText: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.ivoryGlassStrong,
    borderTopWidth: 1,
    borderColor: colors.whiteGlass,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    zIndex: 100,
  },
  bookButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cocoa,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.cocoa,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  bookIcon: {
    marginLeft: 2,
  },
});
