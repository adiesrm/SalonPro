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

type BookingStatusFilter =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

type BookingStatus = | 'pending' | 'confirmed' | 'completed' | 'cancelled';

type BookingStats = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};

const FILTERS: { label: string; value: BookingStatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const SUMMARY_CARDS: {
  key: keyof BookingStats;
  label: string;
  accentColor: string;
}[] = [
  { key: 'total', label: 'Total', accentColor: '#2563EB' },
  { key: 'pending', label: 'Pending', accentColor: '#D97706' },
  { key: 'confirmed', label: 'Confirmed', accentColor: '#4F46E5' },
  { key: 'completed', label: 'Completed', accentColor: '#16A34A' },
];

export default function BookingsScreen(): React.JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState<BookingStatusFilter>('all');
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

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bookings.filter((booking) => {
      const bookingStatus = booking.status?.toLowerCase() ?? 'pending';

      const matchesStatus =
        selectedFilter === 'all' || bookingStatus === selectedFilter;

      const matchesSearch =
        !query ||
        booking.customerName.toLowerCase().includes(query) ||
        booking.serviceName.toLowerCase().includes(query) ||
        booking.barberName.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchQuery, selectedFilter]);

  const bookingStats = useMemo<BookingStats>(() => {
    return bookings.reduce<BookingStats>(
      (stats, booking) => {
       const status = (booking.status?.toLowerCase() ?? 'pending') as BookingStatus;

        stats.total += 1;

        if (status === 'pending') {
          stats.pending += 1;
        }

        if (status === 'confirmed') {
          stats.confirmed += 1;
        }

        if (status === 'completed') {
          stats.completed += 1;
        }
        if (status === 'cancelled') {
  stats.cancelled += 1;
}

        return stats;
      },
      {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      }
    );
  }, [bookings]);

  const handleUpdateStatus = async (
    booking: Booking,
    newStatus: BookingStatus
  ) => {
    try {
      await updateBookingStatus(booking.id, newStatus);
      await loadBookings();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update booking status. Please try again.'
      );
    }
  };

  const handleMenuPress = (booking: Booking) => {
   const currentStatus = booking.status?.toLowerCase() ?? 'pending';

let options: string[] = [];
let actionStatuses: BookingStatus[] = [];

switch (currentStatus) {
  case 'pending':
    options = ['Confirm Booking', 'Cancel Booking', 'Close'];
    actionStatuses = ['confirmed', 'cancelled'];
    break;

  case 'confirmed':
    options = ['Mark as Completed', 'Cancel Booking', 'Close'];
    actionStatuses = ['completed', 'cancelled'];
    break;

  case 'completed':
    options = ['Reopen Booking', 'Close'];
    actionStatuses = ['confirmed'];
    break;

  case 'cancelled':
  case 'canceled':
    options = ['Restore Booking', 'Close'];
    actionStatuses = ['pending'];
    break;

  default:
    options = ['Close'];
    actionStatuses = [];
}
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = options.findIndex(
      (option) => option === 'Cancel Booking'
    );

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex:
          destructiveButtonIndex >= 0 ? destructiveButtonIndex : undefined,
      },
      async (selectedIndex) => {
        if (
          selectedIndex === undefined ||
          selectedIndex === cancelButtonIndex
        ) {
          return;
        }

        const newStatus = actionStatuses[selectedIndex];

        if (newStatus) {
          await handleUpdateStatus(booking, newStatus);
        }
      }
    );
  };

  if (isLoading && bookings.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading bookings...</Text>
      </View>
    );
  }

  if (error && bookings.length === 0) {
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
      <View style={styles.summaryContainer}>
        {SUMMARY_CARDS.map((card) => (
          <View key={card.key} style={styles.summaryCard}>
            <View
              style={[
                styles.summaryAccent,
                { backgroundColor: card.accentColor },
              ]}
            />

            <Text style={[styles.summaryNumber, { color: card.accentColor }]}>
              {bookingStats[card.key]}
            </Text>

            <Text style={styles.summaryLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

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

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(item) => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const isSelected = selectedFilter === item.value;

          return (
            <TouchableOpacity
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(item.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isSelected && styles.filterButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {error ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>

          <TouchableOpacity onPress={() => setError(null)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      ) : null}

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
            <Text style={styles.emptyTitle}>No bookings found</Text>

            <Text style={styles.emptyText}>
              {searchQuery.trim() || selectedFilter !== 'all'
                ? 'Try changing your search or selected filter.'
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

  summaryContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 12,
  },

  summaryCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  summaryAccent: {
    width: 24,
    height: 3,
    marginBottom: 8,
    borderRadius: 10,
  },

  summaryNumber: {
    fontSize: 20,
    fontWeight: '700',
  },

  summaryLabel: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  searchInput: {
    height: 48,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    color: '#0F172A',
    fontSize: 15,
  },

filterList: {
  paddingHorizontal: 16,
  paddingBottom: 14,
  gap: 10,
},

filterButton: {
  minHeight: 50,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 18,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E2E8F0',
  borderRadius: 15,
  elevation: 2,
  shadowColor: '#0F172A',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.08,
  shadowRadius: 3,
},

filterButtonActive: {
  backgroundColor: '#2563EB',
  borderColor: '#2563EB',
  elevation: 3,
},

filterButtonText: {
  color: '#475569',
  fontSize: 13,
  fontWeight: '700',
  textAlign: 'center',
},

filterButtonTextActive: {
  color: '#FFFFFF',
},

  listContent: {
    paddingVertical: 4,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  errorTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
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

  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
  },

  inlineErrorText: {
    flex: 1,
    marginRight: 12,
    color: '#B91C1C',
    fontSize: 13,
  },

  dismissText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});