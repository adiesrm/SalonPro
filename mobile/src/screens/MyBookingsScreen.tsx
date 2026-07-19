import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

import { auth } from "../config/firebase";
import { getUserBookings } from "../services/firestoreService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
interface Booking {
  id: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  status: string;
}

export default function MyBookingsScreen() {
  const navigation = useNavigation<
  NativeStackNavigationProp<RootStackParamList, "MyBookings">
>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "#F59E0B"; // Amber

    case "confirmed":
      return "#22C55E"; // Green

    case "completed":
      return "#3B82F6"; // Blue

    case "cancelled":
      return "#EF4444"; // Red

    default:
      return "#6B7280"; // Gray
  }
};

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const loadBookings = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const data = await getUserBookings(user.uid);

      setBookings(data as Booking[]);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </SafeAreaView>
    );
  }


  if (bookings.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <ArrowLeft size={22} color="#111827" strokeWidth={1.8} />
          </TouchableOpacity>
          <Text style={styles.title}>My Bookings</Text>
          <View style={styles.backButtonSpacer} />
        </View>

        <Text style={styles.emptyText}>
          You haven't booked any appointments yet.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color="#111827" strokeWidth={1.8} />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.service}>
              {item.serviceName}
            </Text>

            <Text style={styles.detail}>
              💈 Barber: {item.barberName}
            </Text>

            <Text style={styles.detail}>
              📅 {item.date}
            </Text>

            <Text style={styles.detail}>
              🕒 {item.time}
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color: getStatusColor(item.status),
                },
              ]}
            >
              Status: {formatStatus(item.status)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 12 : 4,
    paddingBottom: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonSpacer: {
    width: 44,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  service: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  detail: {
    fontSize: 17,
    color: "#374151",
    marginBottom: 6,
  },

  status: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
  },
});