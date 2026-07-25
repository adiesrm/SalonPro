import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
  'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
>('all');
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

  const filteredBookings = useMemo(() => {
  const query = searchQuery.toLowerCase().trim();

  return bookings.filter((booking) => {
    const matchesSearch =
      !query ||
      booking.customerName.toLowerCase().includes(query) ||
      booking.serviceName.toLowerCase().includes(query) ||
      booking.barberName.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [bookings, searchQuery, statusFilter]);

  const handleMenuPress = (booking: Booking) => {
    const options = ['Confirm', 'Complete', 'Cancel Booking', 'Close'];
    const cancelButtonIndex = 3;
    const destructiveButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
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
          await loadBookings();
        } catch (updateError) {
          console.error('Failed to update booking status:', updateError);
          setError(
            updateError instanceof Error
              ? updateError.message
              : 'Unable to update booking status. Please try again.'
          );
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

        <TouchableOpacity style={styles.retryButton} onPress={loadBookings}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search customer, service or barber..."
        placeholderTextColor="#94A3B8"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <View style={styles.filterContainer}>
  {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(
    (status) => (
      <TouchableOpacity
        key={status}
        style={[
          styles.filterChip,
          statusFilter === status && styles.activeFilterChip,
        ]}
        onPress={() => setStatusFilter(status)}
      >
        <Text
          style={[
            styles.filterChipText,
            statusFilter === status && styles.activeFilterChipText,
          ]}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </TouchableOpacity>
    )
  )}
</View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadBookings}
        contentContainerStyle={
          filteredBookings.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim()
                ? 'No matching bookings found'
                : 'No bookings found'}
            </Text>

            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Try searching with a different customer, service, or barber name.'
                : 'Bookings will appear here when customers make appointments.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AdminBookingCard booking={item} onMenuPress={handleMenuPress} />
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

  filterContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingHorizontal: 16,
  marginBottom: 10,
  gap: 8,
},

filterChip: {
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#E2E8F0',
},

activeFilterChip: {
  backgroundColor: '#2563EB',
},

filterChipText: {
  color: '#334155',
  fontWeight: '600',
  fontSize: 13,
},

activeFilterChipText: {
  color: '#FFFFFF',
},

  searchInput: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    color: '#0F172A',
    fontSize: 15,
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
    padding: 24,
    backgroundColor: '#F8FAFC',
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
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});