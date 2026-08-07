import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import {
  Search,
  Calendar,
  Clock,
  User,
  Scissors,
  Sparkles,
  ChevronRight,
  Star,
  Home,
  Crown,
  Bell,
} from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import LuxuryBackground from "../components/LuxuryBackground";

import { colors, theme } from "../theme/theme";
import { getServices } from "../services/firestoreService";

const { width, height } = Dimensions.get("window");

interface HomeScreenProps {
  onNavigateToBookings?: () => void;
  onNavigateToProfile?: () => void;
  onSelectService?: (service: ServiceSelection | string) => void;
}

interface ServiceSelection {
  id?: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  rating?: string;
  description: string;
  whatsIncluded: string[];
}

export default function HomeScreen({
  onNavigateToBookings,
  onNavigateToProfile,
  onSelectService,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "bookings" | "profile">("home");

  const [popularServices, setPopularServices] = useState<ServiceSelection[]>([]);
  useEffect(() => {
  loadServices();
}, []);

const loadServices = async () => {
  try {
    const services = await getServices();
    setPopularServices(services);
  } catch (error) {
    console.log("Failed to load services:", error);
  }
};

  // Mock data for categories
  const categories = [
    { id: "1", name: "Haircut", count: "12 Styles" },
    { id: "2", name: "Beard Styling", count: "8 Options" },
    { id: "3", name: "Facial", count: "5 Rituals" },
    { id: "4", name: "Hair Spa", count: "6 Treatments" },
  ];

  // Mock data for popular services
 

  const handleServiceSelect = (service: ServiceSelection | string) => {
    if (onSelectService) {
      onSelectService(service);
    } else {
      console.log("Selected service:", service);
    }
  };

  const handleTabPress = (tab: "home" | "bookings" | "profile") => {
    setActiveTab(tab);
    if (tab === "bookings" && onNavigateToBookings) {
      onNavigateToBookings();
    } else if (tab === "profile" && onNavigateToProfile) {
      onNavigateToProfile();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <LuxuryBackground />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Block: Greeting and Notifications */}
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.header}
        >
          <View>
            <Text style={styles.greetingText}>Good Evening,</Text>
            <Text style={styles.profileName}>Adi</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Bell size={20} color={colors.cocoa} strokeWidth={1.5} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarPlaceholder}>
                <User size={18} color={colors.gold} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Search Bar Block */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(600)}
          style={styles.searchWrapper}
        >
          <View style={styles.searchContainer}>
            <Search size={18} color={colors.cocoaMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor="#52525B"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        {/* Upcoming Appointment Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <Crown size={14} color={colors.gold} strokeWidth={1.5} />
        </View>

        <Animated.View
          entering={FadeInUp.delay(140).duration(650)}
          style={styles.appointmentCard}
        >
          <View style={styles.appointmentHeader}>
            <View>
              <Text style={styles.appointmentService}>Executive Haircut & Beard</Text>
              <Text style={styles.appointmentBarber}>with Master Barber Jean-Louis</Text>
            </View>
            <View style={styles.appointmentBadge}>
              <Text style={styles.appointmentBadgeText}>CONFIRMED</Text>
            </View>
          </View>

          <View style={styles.appointmentDivider} />

          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <Calendar size={14} color={colors.gold} style={styles.detailIcon} />
              <Text style={styles.detailText}>Today, July 5th</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={14} color={colors.gold} style={styles.detailIcon} />
              <Text style={styles.detailText}>18:30 - 19:30</Text>
            </View>
          </View>
        </Animated.View>

        {/* Categories Horizontal Scroll */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Grooming Services</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => handleServiceSelect(category.name)}
            >
              <View style={styles.categoryIconCircle}>
                <Scissors size={20} color={colors.gold} strokeWidth={1.5} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Services Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Rituals</Text>
          <Sparkles size={14} color={colors.gold} strokeWidth={1.5} />
        </View>

        <View style={styles.popularList}>
          {popularServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.popularCard}
              activeOpacity={0.8}
              onPress={() => {
  console.log(
    "SERVICE PRESSED",
    JSON.stringify(service, null, 2)
  );

  handleServiceSelect(service);
}}
            >
              <View style={styles.popularCardContent}>
                <View style={styles.popularCardLeft}>
                  <Text style={styles.popularCategory}>{service.category}</Text>
                  <Text style={styles.popularName}>{service.name}</Text>
                  <View style={styles.popularMetaRow}>
                    <View style={styles.ratingRow}>
                      <Star size={12} color={colors.gold} fill={colors.gold} />
                      <Text style={styles.popularRating}>{service.rating}</Text>
                    </View>
                    <Text style={styles.metaDivider}>•</Text>
                    <Text style={styles.popularDuration}>{service.duration}</Text>
                  </View>
                </View>
                <View style={styles.popularCardRight}>
                  <Text style={styles.popularPrice}>{service.price}</Text>
                  <View style={styles.bookButtonCircle}>
                    <ChevronRight size={14} color={colors.cream} strokeWidth={2.5} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Luxury Bottom Tab Bar Placeholder */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress("home")}
          activeOpacity={0.7}
        >
          <Home size={22} color={activeTab === "home" ? colors.gold : colors.cocoaMuted} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "home" && styles.tabLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress("bookings")}
          activeOpacity={0.7}
        >
          <Calendar size={22} color={activeTab === "bookings" ? colors.gold : colors.cocoaMuted} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "bookings" && styles.tabLabelActive,
            ]}
          >
            Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress("profile")}
          activeOpacity={0.7}
        >
          <User size={22} color={activeTab === "profile" ? colors.gold : colors.cocoaMuted} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "profile" && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
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
  scrollContent: {
    paddingBottom: 110, // Generous padding to prevent bottom tab overlap
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
  haloInner: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.06)",
    top: height * 0.15,
  },
  goldLineLeft: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.02)",
    left: 40,
  },
  goldLineRight: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.02)",
    right: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 44 : 20,
    marginTop: 12,
    zIndex: 10,
  },
  greetingText: {
    color: colors.cocoaSoft,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  profileName: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: theme.typography.displayFont,
    fontStyle: "italic",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 13,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.ivoryGlass,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    paddingHorizontal: 24,
    marginTop: 24,
    zIndex: 10,
  },
  searchContainer: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: colors.ink,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
    zIndex: 10,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  viewAllText: {
    color: colors.cocoa,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  appointmentCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlassStrong,
    padding: 20,
    zIndex: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  appointmentService: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  appointmentBarber: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  appointmentBadge: {
    backgroundColor: "rgba(205, 163, 90, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(205, 163, 90, 0.32)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appointmentBadgeText: {
    color: colors.cocoa,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  appointmentDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 16,
  },
  appointmentDetails: {
    flexDirection: "row",
    gap: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "500",
  },
  categoriesScroll: {
    paddingLeft: 24,
    paddingRight: 8,
    zIndex: 10,
  },
  categoryCard: {
    width: 120,
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginRight: 16,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.38)",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  categoryCount: {
    color: colors.cocoaMuted,
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
  },
  popularList: {
    paddingHorizontal: 24,
    gap: 12,
    zIndex: 10,
  },
  popularCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlass,
    padding: 16,
  },
  popularCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  popularCardLeft: {
    flex: 1,
  },
  popularCategory: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  popularName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  popularMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  popularRating: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "600",
  },
  metaDivider: {
    color: colors.cocoaMuted,
    marginHorizontal: 8,
  },
  popularDuration: {
    color: colors.muted,
    fontSize: 12,
  },
  popularCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  popularPrice: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  bookButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cocoa,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTabBar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.whiteGlass,
    backgroundColor: colors.ivoryGlassStrong,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabLabel: {
    color: colors.cocoaMuted,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: colors.cocoa,
  },
});
