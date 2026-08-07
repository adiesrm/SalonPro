import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';

import AppointmentCard from '../components/AppointmentCard';
import {
  getBookingsByDate,
  getTodayBookings,
  updateBookingStatus,
  type AppointmentStatus,
  type ScheduleBooking,
} from '../services/scheduleService';

const STATUS_OPTIONS: { label: string; value: AppointmentStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function getDateQueryValue(dayOffset: number): string {
  if (dayOffset === 0) {
    return 'Today';
  }

  if (dayOffset === 1) {
    return 'Tomorrow';
  }

  if (dayOffset === -1) {
    return 'Yesterday';
  }

  const date = new Date();
  date.setDate(date.getDate() + dayOffset);

  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function getDisplayDate(dayOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ScheduleScreen(): React.JSX.Element {
  const [appointments, setAppointments] = useState<ScheduleBooking[]>([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const selectedDate = useMemo(() => getDateQueryValue(dayOffset), [dayOffset]);
  const displayDate = useMemo(() => getDisplayDate(dayOffset), [dayOffset]);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data =
        dayOffset === 0
          ? await getTodayBookings()
          : await getBookingsByDate(selectedDate);

      setAppointments(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load schedule. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [dayOffset, selectedDate]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const handleChangeStatus = (appointment: ScheduleBooking) => {
    const options = [...STATUS_OPTIONS.map((status) => status.label), 'Close'];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = STATUS_OPTIONS.findIndex(
      (status) => status.value === 'cancelled'
    );

    showActionSheetWithOptions(
      {
        cancelButtonIndex,
        destructiveButtonIndex,
        options,
        title: 'Update appointment status',
      },
      async (selectedIndex) => {
        if (
          selectedIndex === undefined ||
          selectedIndex === cancelButtonIndex
        ) {
          return;
        }

        const selectedStatus = STATUS_OPTIONS[selectedIndex];

        if (!selectedStatus) {
          return;
        }

        try {
          setError(null);

          await updateBookingStatus(appointment.id, selectedStatus.value);
          setAppointments((currentAppointments) =>
            currentAppointments.map((currentAppointment) =>
              currentAppointment.id === appointment.id
                ? {
                    ...currentAppointment,
                    status: selectedStatus.value,
                  }
                : currentAppointment
            )
          );
        } catch (updateError) {
          setError(
            updateError instanceof Error
              ? updateError.message
              : 'Unable to update appointment status. Please try again.'
          );
        }
      }
    );
  };

  const handlePreviousDay = () => {
    setDayOffset((currentOffset) => currentOffset - 1);
  };

  const handleNextDay = () => {
    setDayOffset((currentOffset) => currentOffset + 1);
  };

  if (isLoading && appointments.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading schedule...</Text>
      </View>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Could not load schedule</Text>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadAppointments}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigator}>
        <TouchableOpacity
          accessibilityLabel="View previous day"
          accessibilityRole="button"
          onPress={handlePreviousDay}
          style={styles.dayButton}
        >
          <Ionicons color="#2563EB" name="chevron-back" size={22} />
        </TouchableOpacity>

        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>{selectedDate}</Text>
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>

        <TouchableOpacity
          accessibilityLabel="View next day"
          accessibilityRole="button"
          onPress={handleNextDay}
          style={styles.dayButton}
        >
          <Ionicons color="#2563EB" name="chevron-forward" size={22} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>

          <TouchableOpacity onPress={() => setError(null)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        contentContainerStyle={
          appointments.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        data={appointments}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No appointments found</Text>

            <Text style={styles.emptyText}>
              This day has no scheduled bookings yet.
            </Text>
          </View>
        }
        onRefresh={loadAppointments}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onChangeStatus={handleChangeStatus}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  centeredContainer: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: '#64748B',
    fontSize: 15,
    marginTop: 14,
  },
  dateNavigator: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  dayButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  dateInfo: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  dateLabel: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  dateText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 3,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 10,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  inlineError: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
  },
  inlineErrorText: {
    color: '#B91C1C',
    flex: 1,
    fontSize: 13,
    marginRight: 12,
  },
  dismissText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
