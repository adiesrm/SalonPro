import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';

import AdminBookingCard from '../components/AdminBookingCard';

import {
  getBookings,
  updateBookingStatus,
  type Booking,
} from '../services/bookingService';

export default function BookingsScreen(): React.JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getBookings();
      setBookings(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load bookings. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMenuPress = (booking: Booking) => {
    const options = [
      'Confirm',
      'Complete',
      'Cancel Booking',
      'Close',
    ];

    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex) => {
        if (
          selectedIndex === undefined ||
          selectedIndex === cancelButtonIndex
        ) {
          return;
        }

        let status: 'confirmed' | 'completed' | 'cancelled';

        switch (selectedIndex) {
          case 0:
            status = 'confirmed';
            break;

          case 1:
            status = 'completed';
            break;

          case 2:
            status = 'cancelled';
            break;

          default:
            return;
        }

        try {
          await updateBookingStatus(booking.id, status);

          // Refresh the list
          await loadBookings();
        } catch (error) {
          console.error('Failed to update booking status:', error);
        }
      }
    );
  };

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading bookings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Could not load bookings</Text>

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadBookings}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadBookings}
        contentContainerStyle={
          bookings.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No bookings found
            </Text>

            <Text style={styles.emptyText}>
              Bookings will appear here when customers make appointments.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AdminBookingCard
            booking={item}
            onMenuPress={handleMenuPress}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  listContent: {
    paddingVertical: 10,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },

  stateText: {
    marginTop: 14,
    fontSize: 15,
    color: '#64748B',
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },

  errorText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
  },
});