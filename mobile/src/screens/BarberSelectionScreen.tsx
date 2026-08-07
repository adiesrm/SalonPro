import React, { useEffect, useState } from "react";
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
import { ChevronLeft, Star, Crown, User, Check } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import LuxuryBackground from "../components/LuxuryBackground";
import { getBarbers } from "../services/firestoreService";
import { colors, theme } from "../theme/theme";

const { width } = Dimensions.get("window");

interface Barber {
  id: string;
  name: string;
  rating: string;
  role: string;
  description: string;
}

interface BarberSelectionScreenProps {
  onBack?: () => void;
  onContinue?: (selectedBarber: Barber) => void;

  service: {
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
    whatsIncluded: string[];
  };
}

export default function BarberSelectionScreen({
  onBack,
  onContinue,
  service,
}: BarberSelectionScreenProps) {
  const [selectedBarberId, setSelectedBarberId] = useState<string>("3"); // Arjun selected by default (Master Barber)
  const [barbers, setBarbers] = useState<any[]>([]);
  useEffect(() => {
  loadBarbers();
}, []);

const loadBarbers = async () => {
  try {
    const data = await getBarbers();
    setBarbers(data);
  } catch (error) {
    console.log("Failed to load barbers:", error);
  }
};


    

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      console.log("Back pressed");
    }
  };

  const handleContinuePress = () => {
    const selected = barbers.find((b) => b.id === selectedBarberId);
    if (selected && onContinue) {
      onContinue(selected);
    } else {
      console.log("Continue with barber:", selected?.name);
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
        <Text style={styles.headerTitle}>Select Barber</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInUp.duration(650)}
          style={styles.titleSection}
        >
          <Text style={styles.subtitle}>PRESTIGE STYLISTS</Text>
          <Text style={styles.mainTitle}>Choose Your Barber</Text>
          <Text style={styles.description}>
            Select one of our certified master artisans to craft your personal look.
          </Text>
        </Animated.View>

        {/* Barber Cards list */}
        <View style={styles.barberList}>
          {barbers.map((barber) => {
            const isSelected = selectedBarberId === barber.id;
            return (
              <Animated.View
                entering={FadeInUp.delay(80).duration(600)}
                key={barber.id}
              >
              <TouchableOpacity
                style={[
                  styles.barberCard,
                  isSelected && styles.barberCardSelected,
                ]}
                onPress={() => setSelectedBarberId(barber.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatarBorder}>
                    <View style={styles.avatarPlaceholder}>
                      {barber.name === "Arjun" ? (
                        <Crown size={20} color={colors.gold} strokeWidth={1.5} />
                      ) : (
                        <User size={20} color={colors.gold} strokeWidth={1.5} />
                      )}
                    </View>
                  </View>

                  <View style={styles.barberInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.barberName}>{barber.name}</Text>
                      <View style={styles.ratingRow}>
                        <Star size={12} color={colors.gold} fill={colors.gold} />
                        <Text style={styles.ratingText}>{barber.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.barberRole}>{barber.role}</Text>
                  </View>

                  {/* Radio selector */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioInner}>
                        <Check size={10} color={colors.cream} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.barberDescription}>{barber.description}</Text>

                {isSelected && (
                  <View style={styles.selectedIndicatorLine}>
                    <View style={styles.goldCornerTopLeft} />
                    <View style={styles.goldCornerTopRight} />
                    <View style={styles.goldCornerBottomLeft} />
                    <View style={styles.goldCornerBottomRight} />
                  </View>
                )}
              </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Button Container */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinuePress}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>CONTINUE</Text>
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
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.03)",
    top: -width * 0.4,
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
    paddingBottom: 120, // Padding to prevent bottom bar overlap
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
    zIndex: 10,
  },
  subtitle: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  mainTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: theme.typography.displayFont,
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  barberList: {
    paddingHorizontal: 24,
    gap: 16,
    zIndex: 10,
  },
  barberCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
    padding: 20,
    position: "relative",
  },
  barberCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.ivoryGlassStrong,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  barberInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barberName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(205, 163, 90, 0.16)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    color: colors.cocoa,
    fontSize: 10,
    fontWeight: "700",
  },
  barberRole: {
    color: colors.cocoaSoft,
    fontSize: 12,
    marginTop: 2,
  },
  barberDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 68,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.cocoa,
    backgroundColor: colors.cocoa,
  },
  radioInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIndicatorLine: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    pointerEvents: "none",
  },
  goldCornerTopLeft: {
    position: "absolute",
    top: -1,
    left: -1,
    width: 10,
    height: 10,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: colors.gold,
  },
  goldCornerTopRight: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: colors.gold,
  },
  goldCornerBottomLeft: {
    position: "absolute",
    bottom: -1,
    left: -1,
    width: 10,
    height: 10,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: colors.gold,
  },
  goldCornerBottomRight: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: colors.gold,
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
  continueButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cocoa,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.cocoa,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
