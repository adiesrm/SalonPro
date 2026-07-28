import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Barber } from '../services/barberService';

interface StaffCardProps {
  barber: Barber;
  onEdit: (barber: Barber) => void;
  onToggleStatus: (barber: Barber) => void;
}

const getInitials = (name: string): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || '?';
};

export default function StaffCard({
  barber,
  onEdit,
  onToggleStatus,
}: StaffCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(barber.name)}</Text>
          </View>

          <View style={styles.identityText}>
            <Text numberOfLines={1} style={styles.name}>
              {barber.name || 'Unnamed Staff'}
            </Text>
            <Text numberOfLines={1} style={styles.role}>
              {barber.role || 'Barber'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            barber.isActive ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              barber.isActive
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {barber.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons color="#D97706" name="star" size={16} />
        <Text style={styles.metaText}>{barber.rating || 'No rating'}</Text>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {barber.description || 'No staff description added yet.'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          accessibilityLabel={`Edit ${barber.name}`}
          accessibilityRole="button"
          onPress={() => onEdit(barber)}
          style={styles.secondaryButton}
        >
          <Ionicons color="#2563EB" name="create-outline" size={17} />
          <Text style={styles.secondaryButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={
            barber.isActive
              ? `Mark ${barber.name} inactive`
              : `Mark ${barber.name} active`
          }
          accessibilityRole="button"
          onPress={() => onToggleStatus(barber)}
          style={[
            styles.toggleButton,
            barber.isActive ? styles.deactivateButton : styles.activateButton,
          ]}
        >
          <Ionicons
            color={barber.isActive ? '#B91C1C' : '#166534'}
            name={barber.isActive ? 'pause-circle-outline' : 'play-circle-outline'}
            size={17}
          />
          <Text
            style={[
              styles.toggleButtonText,
              barber.isActive
                ? styles.deactivateButtonText
                : styles.activateButtonText,
            ]}
          >
            {barber.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
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
  identityRow: {
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
  identityText: {
    flex: 1,
  },
  name: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  role: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 3,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusActive: {
    backgroundColor: '#DCFCE7',
  },
  statusInactive: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#166534',
  },
  statusTextInactive: {
    color: '#475569',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 14,
  },
  metaText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  description: {
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    paddingVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  deactivateButton: {
    backgroundColor: '#FEF2F2',
  },
  activateButton: {
    backgroundColor: '#F0FDF4',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  deactivateButtonText: {
    color: '#B91C1C',
  },
  activateButtonText: {
    color: '#166534',
  },
});
