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

  Alert,
} from "react-native";
import { Check, Sparkles, Calendar, Clock, User, Scissors, Crown } from "lucide-react-native";
import { auth } from "../config/firebase";
import { createBooking } from "../services/firestoreService";

const { width } = Dimensions.get("window");

interface BookingConfirmationScreenProps {
  onReturnHome?: () => void;

  bookingDetails?: {
    service: {
      name: string;
      category: string;
      price: string;
      duration: string;
      description: string;
      whatsIncluded: string[];
    };

    barber: {
      id: string;
      name: string;
      role: string;
      rating: string;
    };

    date: string;
    time: string;
  };
}

export default function BookingConfirmationScreen({
  onReturnHome,
  bookingDetails,
}: BookingConfirmationScreenProps) {
 const details = {
  serviceName: bookingDetails?.service.name ?? "Haircut",
  barberName: bookingDetails?.barber.name ?? "Arjun",
  date: bookingDetails?.date ?? "Tomorrow",
  time: bookingDetails?.time ?? "11:00 AM",
};

const handleReturnHomePress = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "Please log in again.");
      return;
    }

    if (!bookingDetails) {
      Alert.alert("Error", "Booking details not found.");
      return;
    }

    await createBooking({
      userId: user.uid,
      customerName: user.displayName ?? "Customer",

      serviceId: bookingDetails.service.name,
      serviceName: bookingDetails.service.name,

      barberId: bookingDetails.barber.id,
      barberName: bookingDetails.barber.name,

      date: bookingDetails.date,
      time: bookingDetails.time,

      duration: Number(
        bookingDetails.service.duration.replace(/[^\d]/g, "")
      ),

      price: Number(
        bookingDetails.service.price.replace(/[^\d]/g, "")
      ),

      status: "pending",
    });

    onReturnHome?.();
  } catch (error) {
    console.error(error);
    Alert.alert(
      "Booking Failed",
      "Unable to save your booking. Please try again."
    );
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Luxury Background Accents */}
      <View style={styles.backgroundDecoratorContainer} pointerEvents="none">
        <View style={styles.haloOuter} />
        <View style={styles.goldLineLeft} />
        <View style={styles.goldLineRight} />
      </View>

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconWrapper}>
          <View style={styles.successIconOuterCircle}>
            <View style={styles.successIconInnerCircle}>
              <Check size={38} color="#10B981" strokeWidth={3} />
            </View>
          </View>
          <View style={styles.sparkleLeft}>
            <Sparkles size={16} color="#D4AF37" />
          </View>
          <View style={styles.sparkleRight}>
            <Sparkles size={16} color="#D4AF37" />
          </View>
        </View>

        {/* Success Header */}
        <Text style={styles.subtitle}>RESERVATION SECURED</Text>
        <Text style={styles.mainTitle}>Booking Confirmed</Text>

        {/* Thank You Message */}
        <Text style={styles.thankYouText}>
          Thank you for choosing Salon Pro Expo. Your luxury grooming appointment has been registered in our prestige system. We look forward to delivering your tailored experience.
        </Text>

        {/* Receipt / Details Card */}
        <View style={styles.receiptCard}>
          <View style={styles.goldCornerTopLeft} />
          <View style={styles.goldCornerTopRight} />
          <View style={styles.goldCornerBottomLeft} />
          <View style={styles.goldCornerBottomRight} />

          <Text style={styles.receiptHeader}>APPOINTMENT SUMMARY</Text>

          {/* Row: Service */}
          <View style={styles.receiptRow}>
            <View style={styles.labelContainer}>
              <Scissors size={14} color="#71717A" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>SERVICE</Text>
            </View>
            <Text style={styles.rowValue}>{details.serviceName}</Text>
          </View>

          <View style={styles.rowDivider} />

          {/* Row: Barber */}
          <View style={styles.receiptRow}>
            <View style={styles.labelContainer}>
              <User size={14} color="#71717A" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>BARBER</Text>
            </View>
            <Text style={styles.rowValue}>{details.barberName}</Text>
          </View>

          <View style={styles.rowDivider} />

          {/* Row: Date */}
          <View style={styles.receiptRow}>
            <View style={styles.labelContainer}>
              <Calendar size={14} color="#71717A" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>DATE</Text>
            </View>
            <Text style={styles.rowValue}>{details.date}</Text>
          </View>

          <View style={styles.rowDivider} />

          {/* Row: Time */}
          <View style={styles.receiptRow}>
            <View style={styles.labelContainer}>
              <Clock size={14} color="#71717A" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>TIME</Text>
            </View>
            <Text style={styles.rowValue}>{details.time}</Text>
          </View>
        </View>

        {/* Salon Assurance */}
        <View style={styles.assuranceNote}>
          <Crown size={14} color="#D4AF37" strokeWidth={1.5} />
          <Text style={styles.assuranceText}>
            A confirmation notification has been sent to your registered profile.
          </Text>
        </View>
      </View>

      {/* Floating Bottom Button Container */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleReturnHomePress}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>RETURN HOME</Text>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 10,
    marginTop: -20,
  },
  successIconWrapper: {
    position: "relative",
    marginBottom: 24,
  },
  successIconOuterCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 185, 129, 0.03)",
  },
  successIconInnerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
  },
  sparkleLeft: {
    position: "absolute",
    top: 4,
    left: -8,
  },
  sparkleRight: {
    position: "absolute",
    bottom: 8,
    right: -8,
  },
  subtitle: {
    color: "#D4AF37",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
    marginBottom: 16,
  },
  thankYouText: {
    color: "#71717A",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  receiptCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)",
    backgroundColor: "rgba(24, 24, 27, 0.7)",
    paddingVertical: 24,
    paddingHorizontal: 24,
    position: "relative",
    marginBottom: 24,
  },
  receiptHeader: {
    color: "#A1A1AA",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 18,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    marginRight: 8,
  },
  rowLabel: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  rowValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "rgba(39, 39, 42, 0.4)",
    width: "100%",
  },
  assuranceNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  assuranceText: {
    color: "#52525B",
    fontSize: 11,
  },
  goldCornerTopLeft: {
    position: "absolute",
    top: -1,
    left: -1,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#D4AF37",
  },
  goldCornerTopRight: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#D4AF37",
  },
  goldCornerBottomLeft: {
    position: "absolute",
    bottom: -1,
    left: -1,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#D4AF37",
  },
  goldCornerBottomRight: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
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
  homeButton: {
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
  homeButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});