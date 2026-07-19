import React, { useState } from "react";
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
import { ChevronLeft, Calendar, Clock, Sparkles, Check } from "lucide-react-native";

const { width } = Dimensions.get("window");

interface DateTimeSelectionScreenProps {
  onBack?: () => void;
  onConfirmBooking?: (selectedDate: string, selectedTime: string) => void;
}

export default function DateTimeSelectionScreen({
  onBack,
  onConfirmBooking,
}: DateTimeSelectionScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");

  const dates = ["Today", "Tomorrow", "Friday"];
  const times = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      console.log("Back pressed");
    }
  };

  const handleConfirmPress = () => {
    if (onConfirmBooking) {
      onConfirmBooking(selectedDate, selectedTime);
    } else {
      console.log("Booking Confirmed for:", selectedDate, "at", selectedTime);
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
        <Text style={styles.headerTitle}>Select Schedule</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.subtitle}>RESERVE SESSION</Text>
          <Text style={styles.mainTitle}>Select Date & Time</Text>
          <Text style={styles.description}>
            Choose your preferred date and time slot for your premium grooming ritual.
          </Text>
        </View>

        {/* Date Selection Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Calendar size={14} color="#D4AF37" strokeWidth={1.5} />
        </View>

        <View style={styles.datesRow}>
          {dates.map((date) => {
            const isSelected = selectedDate === date;
            return (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateCard,
                  isSelected && styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <View style={styles.selectedTick}>
                    <Check size={8} color="#050505" strokeWidth={3} />
                  </View>
                )}
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.dateTextSelected,
                  ]}
                >
                  {date}
                </Text>
                <Text style={styles.dateLabel}>July 2026</Text>

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

        {/* Time Selection Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <Clock size={14} color="#D4AF37" strokeWidth={1.5} />
        </View>

        <View style={styles.timeGrid}>
          {times.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  isSelected && styles.timeCardSelected,
                ]}
                onPress={() => setSelectedTime(time)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.timeText,
                    isSelected && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
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

        {/* Premium Note */}
        <View style={styles.noteCard}>
          <Sparkles size={16} color="#D4AF37" strokeWidth={1.5} />
          <Text style={styles.noteText}>
            Please arrive 10 minutes prior to your scheduled session to enjoy our signature complimentary beverage lounge.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Button Container */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPress}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>CONFIRM BOOKING</Text>
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
    paddingBottom: 120,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 16,
    zIndex: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  datesRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    zIndex: 10,
  },
  dateCard: {
    flex: 1,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dateCardSelected: {
    borderColor: "rgba(212, 175, 55, 0.4)",
    backgroundColor: "rgba(24, 24, 27, 0.8)",
  },
  selectedTick: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    color: "#A1A1AA",
    fontSize: 15,
    fontWeight: "600",
  },
  dateTextSelected: {
    color: "#FFFFFF",
  },
  dateLabel: {
    color: "#52525B",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
    zIndex: 10,
  },
  timeCard: {
    width: (width - 48 - 24) / 3, // Three columns layout
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  timeCardSelected: {
    borderColor: "rgba(212, 175, 55, 0.4)",
    backgroundColor: "rgba(24, 24, 27, 0.8)",
  },
  timeText: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "600",
  },
  timeTextSelected: {
    color: "#D4AF37",
  },
  selectedIndicatorLine: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    pointerEvents: "none",
  },
  goldCornerTopLeft: {
    position: "absolute",
    top: -1,
    left: -1,
    width: 8,
    height: 8,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: "#D4AF37",
  },
  goldCornerTopRight: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: "#D4AF37",
  },
  goldCornerBottomLeft: {
    position: "absolute",
    bottom: -1,
    left: -1,
    width: 8,
    height: 8,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: "#D4AF37",
  },
  goldCornerBottomRight: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: "#D4AF37",
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.12)",
    backgroundColor: "rgba(212, 175, 55, 0.02)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 32,
    zIndex: 10,
  },
  noteText: {
    flex: 1,
    color: "#A1A1AA",
    fontSize: 12,
    lineHeight: 18,
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
  confirmButton: {
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
  confirmButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});