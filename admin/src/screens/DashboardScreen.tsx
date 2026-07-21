import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
} from '@react-navigation/native';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';

import { StatCard } from '../components/StatCard';
import { QuickActionCard } from '../components/QuickActionCard';
import { BookingCard } from '../components/BookingCard';

import { logout } from '../services/authService';

import {
  getDashboardStats,
  getRecentBookings,
  DashboardStats,
  RecentBooking,
} from '../services/dashboardService';

export default function DashboardScreen() {
  const navigation =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingAppointments: 0,
    activeStaff: 0,
    totalCustomers: 0,
  });

  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  async function handleLogout() {
    await logout();
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [dashboardStats, bookings] = await Promise.all([
          getDashboardStats(),
          getRecentBookings(),
        ]);

        setStats(dashboardStats);
        setRecentBookings(bookings);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons
          name="warning-outline"
          size={52}
          color="#EF4444"
        />
        <Text style={styles.loadingText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning, Admin 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.profileAvatar}>
  <Ionicons name="person" size={24} color="#FFFFFF" />
</View>
        </View>

        {/* 2. Overview Cards (2x2 Grid) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.grid}>
            <StatCard
  title="Total Bookings"
  value={stats.totalBookings.toString()}
  icon="calendar-outline"
  color="#3B82F6"
/>

<StatCard
  title="Upcoming Appointments"
  value={stats.upcomingAppointments.toString()}
  icon="time-outline"
  color="#10B981"
/>

<StatCard
  title="Active Staff"
  value={stats.activeStaff.toString()}
  icon="people-outline"
  color="#8B5CF6"
/>

<StatCard
  title="Total Customers"
  value={stats.totalCustomers.toString()}
  icon="heart-outline"
  color="#F43F5E"
/>
          </View>
        </View>

        {/* 3. Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            <QuickActionCard
  title="Manage Bookings"
  description="View & edit schedule"
  icon="calendar"
  onPress={() => navigation.navigate('Bookings')}
/>

<QuickActionCard
  title="Manage Services"
  description="Update salon menu"
  icon="cut"
  onPress={() => navigation.navigate('Services')}
/>

<QuickActionCard
  title="Manage Staff"
  description="Rosters & performance"
  icon="briefcase"
  onPress={() => navigation.navigate('Staff')}
/>

<QuickActionCard
  title="Manage Customers"
  description="Client history & notes"
  icon="person-add"
  onPress={() => navigation.navigate('Customers')}
/>
          </ScrollView>
        </View>

      {/* 4. Recent Bookings */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Recent Bookings</Text>

  {recentBookings.length === 0 ? (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="calendar-outline"
        size={48}
        color="#9CA3AF"
      />
      <Text style={styles.emptyTitle}>
        No recent bookings
      </Text>
      <Text style={styles.emptySubtitle}>
        New bookings will appear here.
      </Text>
    </View>
  ) : (
    recentBookings.map((booking) => (
      <BookingCard
        key={booking.id}
        name={booking.name}
        service={booking.service}
        time={booking.time}
        status={booking.status}
        avatarUrl={booking.avatarUrl}
      />
    ))
  )}
</View>

        {/* 5. Bottom Section (Logout) */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
  style={styles.logoutButton}
  activeOpacity={0.8}
  onPress={handleLogout}
>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 24,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  quickActionsScroll: {
    paddingHorizontal: 24,
    paddingRight: 12, // Accounts for the margin on the last card
  },
  bottomSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#DC2626',
},

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F8F9FA',
},

loadingText: {
  marginTop: 16,
  fontSize: 16,
  fontWeight: '500',
  color: '#6B7280',
},

emptyContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 40,
  paddingHorizontal: 24,
},

emptyTitle: {
  marginTop: 12,
  fontSize: 18,
  fontWeight: '700',
  color: '#111827',
},

emptySubtitle: {
  marginTop: 6,
  fontSize: 14,
  textAlign: 'center',
  color: '#6B7280',
},

});