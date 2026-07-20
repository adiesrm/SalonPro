import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type StatusType = 'Confirmed' | 'Pending' | 'Completed';

interface BookingCardProps {
  name: string;
  service: string;
  time: string;
  status: StatusType;
  avatarUrl: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({ name, service, time, status, avatarUrl }) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'Confirmed':
        return { bg: '#DEF7EC', text: '#03543F' };
      case 'Pending':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'Completed':
        return { bg: '#E1EFFE', text: '#1E429F' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const statusStyle = getStatusStyles(status);

  return (
    <View style={styles.card}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.service}>{service}</Text>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.time}>{time}</Text>
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeText, { color: statusStyle.text }]}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  service: {
    fontSize: 13,
    color: '#6B7280',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});