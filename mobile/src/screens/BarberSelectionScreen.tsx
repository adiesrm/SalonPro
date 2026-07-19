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

import { getBarbers } from "../services/firestoreService";

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
      <StatusBar style="light" />

      {/* Decorative Luxury Background Halos */}
      <View style={styles.backgroundDecoratorContainer} pointerEvents="none">
        <View style={styles.haloOuter} />
        <View style={styles.goldLineLeft} />
        <View style={styles.goldLineRight} />
      </View>

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Barber</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subtitle}>PRESTIGE STYLISTS</Text>
          <Text style={styles.mainTitle}>Choose Your Barber</Text>
          <Text style={styles.description}>
            Select one of our certified master artisans to craft your personal look.
          </Text>
        </View>

        {/* Barber Cards list */}
        <View style={styles.barberList}>
          {barbers.map((barber) => {
            const isSelected = selectedBarberId === barber.id;
            return (
              <TouchableOpacity
                key={barber.id}
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
                        <Crown size={20} color="#D4AF37" strokeWidth={1.5} />
                      ) : (
                        <User size={20} color="#D4AF37" strokeWidth={1.5} />
                      )}
                    </View>
                  </View>

                  <View style={styles.barberInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.barberName}>{barber.name}</Text>
                      <View style={styles.ratingRow}>
                        <Star size={12} color="#D4AF37" fill="#D4AF37" />
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
                        <Check size={10} color="#050505" strokeWidth={3} />
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
    backgroundColor: "#050505",
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
    borderColor: "rgba(39, 39, 42, 0.5)",
    backgroundColor: "rgba(5, 5, 5, 0.9)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
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
    color: "#D4AF37",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  description: {
    color: "#71717A",
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
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    padding: 20,
    position: "relative",
  },
  barberCardSelected: {
    borderColor: "rgba(212, 175, 55, 0.4)",
    backgroundColor: "rgba(24, 24, 27, 0.8)",
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
    borderColor: "rgba(212, 175, 55, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(212, 175, 55, 0.04)",
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
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: "700",
  },
  barberRole: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 2,
  },
  barberDescription: {
    color: "#71717A",
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 68,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#52525B",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#D4AF37",
    backgroundColor: "#D4AF37",
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
    borderColor: "#D4AF37",
  },
  goldCornerTopRight: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: "#D4AF37",
  },
  goldCornerBottomLeft: {
    position: "absolute",
    bottom: -1,
    left: -1,
    width: 10,
    height: 10,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: "#D4AF37",
  },
  goldCornerBottomRight: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: "#D4AF37",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(5, 5, 5, 0.95)",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    zIndex: 100,
  },
  continueButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});