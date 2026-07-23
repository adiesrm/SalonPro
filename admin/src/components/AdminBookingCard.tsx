import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Booking } from '../services/bookingService';

interface Props {
  booking: Booking;
  onMenuPress?: (booking: Booking) => void;
}

type BookingData = Record<string, unknown>;

const getText = (value: unknown, fallback = '—'): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return fallback;
};

const getNestedText = (
  value: unknown,
  keys: string[],
  fallback = '—',
): string => {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const data = value as BookingData;

  for (const key of keys) {
    const text = getText(data[key], '');
    if (text) {
      return text;
    }
  }

  return fallback;
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

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'completed':
      return styles.statusSuccess;
    case 'pending':
      return styles.statusPending;
    case 'cancelled':
    case 'canceled':
      return styles.statusCancelled;
    default:
      return styles.statusDefault;
  }
};

const getStatusTextStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'completed':
      return styles.statusTextSuccess;
    case 'pending':
      return styles.statusTextPending;
    case 'cancelled':
    case 'canceled':
      return styles.statusTextCancelled;
    default:
      return styles.statusTextDefault;
  }
};

export default function AdminBookingCard({
  booking,
  onMenuPress,
}: Props): React.JSX.Element {
  const data = booking as unknown as BookingData;

  const customerName =
    getNestedText(data.customer, ['name', 'full_name', 'fullName'], '') ||
    getText(data.customerName, '') ||
    getText(data.customer_name, '') ||
    'Unknown Customer';

  const service =
    getNestedText(data.service, ['name', 'title'], '') ||
    getText(data.serviceName, '') ||
    getText(data.service_name, '') ||
    '—';

  const barber =
    getNestedText(data.barber, ['name', 'full_name', 'fullName'], '') ||
    getText(data.barberName, '') ||
    getText(data.barber_name, '') ||
    '—';

  const date =
    getText(data.date, '') ||
    getText(data.bookingDate, '') ||
    getText(data.booking_date, '') ||
    getText(data.appointmentDate, '') ||
    getText(data.appointment_date, '') ||
    '—';

  const time =
    getText(data.time, '') ||
    getText(data.bookingTime, '') ||
    getText(data.booking_time, '') ||
    getText(data.appointmentTime, '') ||
    getText(data.appointment_time, '') ||
    '—';

  const priceValue =
    data.price ?? data.totalPrice ?? data.total_price ?? data.amount;
  const price =
    typeof priceValue === 'number'
      ? `₹${priceValue.toFixed(2)}`
      : getText(priceValue);

  const status = getText(data.status, 'Pending');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(customerName)}</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text numberOfLines={1} style={styles.customerName}>
              {customerName}
            </Text>
            <Text numberOfLines={1} style={styles.service}>
              {service}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel={`Open menu for ${customerName}`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => onMenuPress?.(booking)}
          style={styles.menuButton}
        >
          <Ionicons color="#64748B" name="ellipsis-vertical" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons color="#64748B" name="calendar-outline" size={17} />
          <Text style={styles.detailText}>{date}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons color="#64748B" name="time-outline" size={17} />
          <Text style={styles.detailText}>{time}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons color="#64748B" name="person-outline" size={17} />
          <Text style={styles.detailText}>{barber}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>{price}</Text>

        <Pressable style={[styles.statusBadge, getStatusStyle(status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(status)]}>
            {status}
          </Text>
        </Pressable>
      </View>
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
  menuButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 32,
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
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  price: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
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
  statusDefault: {
    backgroundColor: '#E2E8F0',
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
  statusTextDefault: {
    color: '#475569',
  },
});