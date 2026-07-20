import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { StatCard } from '../components/StatCard';
import { QuickActionCard } from '../components/QuickActionCard';
import { BookingCard } from '../components/BookingCard';
import { logout } from '../services/authService';

export default function DashboardScreen() {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  async function handleLogout() {
    await logout();
  }

  
  // Placeholder Data
  const recentBookings = [
    {
      id: '1',
      name: 'Sarah Johnson',
      service: 'Haircut + Styling',
      time: '10:30 AM',
      status: 'Confirmed' as const,
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=FCE7F3&color=DB2777',
    },
    {
      id: '2',
      name: 'Michael Brown',
      service: 'Hair Color',
      time: '11:15 AM',
      status: 'Pending' as const,
      avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Brown&background=E0E7FF&color=4F46E5',
    },
    {
      id: '3',
      name: 'Priya Sharma',
      service: 'Facial',
      time: '1:00 PM',
      status: 'Completed' as const,
      avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=DCFCE7&color=16A34A',
    },
  ];

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
            <StatCard title="Today's Bookings" value="24" icon="calendar-outline" color="#3B82F6" />
            <StatCard
  title="Upcoming Appointments"
  value="18"
  icon="time-outline"
  color="#10B981"
/>
            <StatCard title="Active Staff" value="8" icon="people-outline" color="#8B5CF6" />
            <StatCard title="Total Customers" value="1,432" icon="heart-outline" color="#F43F5E" />
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
            />
            <QuickActionCard 
              title="Manage Services" 
              description="Update salon menu" 
              icon="cut" 
            />
            <QuickActionCard 
              title="Manage Staff" 
              description="Rosters & performance" 
              icon="briefcase" 
            />
            <QuickActionCard 
              title="Manage Customers" 
              description="Client history & notes" 
              icon="person-add" 
            />
          </ScrollView>
        </View>

      {/* 4. Recent Bookings */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Recent Bookings</Text>

  {recentBookings.map((booking) => (
    <BookingCard
      key={booking.id}
      name={booking.name}
      service={booking.service}
      time={booking.time}
      status={booking.status}
      avatarUrl={booking.avatarUrl}
    />
  ))}
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
});