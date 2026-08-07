import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type {
  AppointmentStatus,
  ScheduleBooking,
} from '../services/scheduleService';

interface AppointmentCardProps {
  appointment: ScheduleBooking;
  onChangeStatus: (appointment: ScheduleBooking) => void;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const getInitials = (name: string): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || '?';
};

const getStatusStyle = (status: AppointmentStatus) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return styles.statusSuccess;
    case 'cancelled':
      return styles.statusCancelled;
    case 'pending':
    default:
      return styles.statusPending;
  }
};

const getStatusTextStyle = (status: AppointmentStatus) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return styles.statusTextSuccess;
    case 'cancelled':
      return styles.statusTextCancelled;
    case 'pending':
    default:
      return styles.statusTextPending;
  }
};

export default function AppointmentCard({
  appointment,
  onChangeStatus,
}: AppointmentCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(appointment.customerName)}
            </Text>
          </View>

          <View style={styles.customerInfo}>
            <Text numberOfLines={1} style={styles.customerName}>
              {appointment.customerName}
            </Text>
            <Text numberOfLines={1} style={styles.service}>
              {appointment.serviceName}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel={`Status ${STATUS_LABELS[appointment.status]}`}
          style={[styles.statusBadge, getStatusStyle(appointment.status)]}
        >
          <Text
            style={[
              styles.statusText,
              getStatusTextStyle(appointment.status),
            ]}
          >
            {STATUS_LABELS[appointment.status]}
          </Text>
        </Pressable>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons color="#64748B" name="time-outline" size={17} />
          <Text style={styles.detailText}>{appointment.time}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons color="#64748B" name="person-outline" size={17} />
          <Text style={styles.detailText}>{appointment.barberName}</Text>
        </View>
      </View>

      <TouchableOpacity
        accessibilityLabel={`Change status for ${appointment.customerName}`}
        accessibilityRole="button"
        onPress={() => onChangeStatus(appointment)}
        style={styles.actionButton}
      >
        <Ionicons color="#2563EB" name="swap-horizontal-outline" size={17} />
        <Text style={styles.actionButtonText}>Change Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    marginHorizontal: 16,
    marginVertical: 7,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  avatarText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '700',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  service: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 3,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusSuccess: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusTextSuccess: {
    color: '#166534',
  },
  statusTextPending: {
    color: '#92400E',
  },
  statusTextCancelled: {
    color: '#B91C1C',
  },
  details: {
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    marginTop: 16,
    paddingVertical: 12,
  },
  detailItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 4,
  },
  detailText: {
    color: '#475569',
    fontSize: 14,
    marginLeft: 8,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 11,
  },
  actionButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
});
