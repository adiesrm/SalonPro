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

import { getServices } from "../services/firestoreService";

const { width, height } = Dimensions.get("window");

interface HomeScreenProps {
  onNavigateToBookings?: () => void;
  onNavigateToProfile?: () => void;
  onSelectService?: (serviceName: string) => void;
}

export default function HomeScreen({
  onNavigateToBookings,
  onNavigateToProfile,
  onSelectService,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "bookings" | "profile">("home");

  const [popularServices, setPopularServices] = useState<any[]>([]);
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
 

  const handleServiceSelect = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    } else {
      console.log("Selected service:", serviceName);
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
      <StatusBar style="light" />

      {/* Decorative Luxury Background Halos */}
      <View style={styles.backgroundDecoratorContainer} pointerEvents="none">
        <View style={styles.haloOuter} />
        <View style={styles.haloInner} />
        <View style={styles.goldLineLeft} />
        <View style={styles.goldLineRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Block: Greeting and Notifications */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Good Evening,</Text>
            <Text style={styles.profileName}>Adi</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Bell size={20} color="#FFFFFF" strokeWidth={1.5} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarPlaceholder}>
                <User size={18} color="#D4AF37" />
              </View>
            </View>
          </View>
        </View>

        {/* Search Bar Block */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#52525B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor="#52525B"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Upcoming Appointment Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <Crown size={14} color="#D4AF37" strokeWidth={1.5} />
        </View>

        <View style={styles.appointmentCard}>
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
              <Calendar size={14} color="#D4AF37" style={styles.detailIcon} />
              <Text style={styles.detailText}>Today, July 5th</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={14} color="#D4AF37" style={styles.detailIcon} />
              <Text style={styles.detailText}>18:30 - 19:30</Text>
            </View>
          </View>
        </View>

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
                <Scissors size={20} color="#D4AF37" strokeWidth={1.5} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Services Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Rituals</Text>
          <Sparkles size={14} color="#D4AF37" strokeWidth={1.5} />
        </View>

        <View style={styles.popularList}>
          {popularServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.popularCard}
              activeOpacity={0.8}
              onPress={() => handleServiceSelect(service.name)}
            >
              <View style={styles.popularCardContent}>
                <View style={styles.popularCardLeft}>
                  <Text style={styles.popularCategory}>{service.category}</Text>
                  <Text style={styles.popularName}>{service.name}</Text>
                  <View style={styles.popularMetaRow}>
                    <View style={styles.ratingRow}>
                      <Star size={12} color="#D4AF37" fill="#D4AF37" />
                      <Text style={styles.popularRating}>{service.rating}</Text>
                    </View>
                    <Text style={styles.metaDivider}>•</Text>
                    <Text style={styles.popularDuration}>{service.duration}</Text>
                  </View>
                </View>
                <View style={styles.popularCardRight}>
                  <Text style={styles.popularPrice}>{service.price}</Text>
                  <View style={styles.bookButtonCircle}>
                    <ChevronRight size={14} color="#050505" strokeWidth={2.5} />
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
          <Home size={22} color={activeTab === "home" ? "#D4AF37" : "#52525B"} />
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
          <Calendar size={22} color={activeTab === "bookings" ? "#D4AF37" : "#52525B"} />
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
          <User size={22} color={activeTab === "profile" ? "#D4AF37" : "#52525B"} />
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
    backgroundColor: "#050505",
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
    color: "#A1A1AA",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  profileName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
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
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
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
    backgroundColor: "#D4AF37",
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(212, 175, 55, 0.05)",
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
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.7)",
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
    color: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  viewAllText: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  appointmentCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    backgroundColor: "rgba(24, 24, 27, 0.85)",
    padding: 20,
    zIndex: 10,
    shadowColor: "#D4AF37",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  appointmentBarber: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 4,
  },
  appointmentBadge: {
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appointmentBadgeText: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  appointmentDivider: {
    height: 1,
    backgroundColor: "#27272A",
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
    color: "#FFFFFF",
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
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginRight: 16,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  categoryCount: {
    color: "#52525B",
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
    borderColor: "#27272A",
    backgroundColor: "rgba(24, 24, 27, 0.6)",
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
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  popularName: {
    color: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  metaDivider: {
    color: "#52525B",
    marginHorizontal: 8,
  },
  popularDuration: {
    color: "#A1A1AA",
    fontSize: 12,
  },
  popularCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  popularPrice: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bookButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D4AF37",
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
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(10, 10, 10, 0.95)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 100,
    shadowColor: "#000000",
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
    color: "#52525B",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: "#D4AF37",
  },
});