import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Service } from '../services/serviceService';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
}

export default function ServiceCard({
  service,
  onEdit,
  onToggleStatus,
}: ServiceCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons color="#2563EB" name="cut-outline" size={22} />
        </View>

        <View style={styles.titleGroup}>
          <Text numberOfLines={1} style={styles.name}>
            {service.name || 'Unnamed Service'}
          </Text>
          <Text numberOfLines={1} style={styles.category}>
            {service.category || 'Service'}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            service.isActive ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              service.isActive
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {service.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons color="#64748B" name="cash-outline" size={16} />
          <Text style={styles.metaText}>{service.price || 'No price'}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons color="#64748B" name="time-outline" size={16} />
          <Text style={styles.metaText}>{service.duration || 'No duration'}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons color="#D97706" name="star" size={16} />
          <Text style={styles.metaText}>{service.rating || 'No rating'}</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {service.description || 'No service description added yet.'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          accessibilityLabel={`Edit ${service.name}`}
          accessibilityRole="button"
          onPress={() => onEdit(service)}
          style={styles.secondaryButton}
        >
          <Ionicons color="#2563EB" name="create-outline" size={17} />
          <Text style={styles.secondaryButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={
            service.isActive
              ? `Mark ${service.name} inactive`
              : `Mark ${service.name} active`
          }
          accessibilityRole="button"
          onPress={() => onToggleStatus(service)}
          style={[
            styles.toggleButton,
            service.isActive ? styles.deactivateButton : styles.activateButton,
          ]}
        >
          <Ionicons
            color={service.isActive ? '#B91C1C' : '#166534'}
            name={
              service.isActive
                ? 'pause-circle-outline'
                : 'play-circle-outline'
            }
            size={17}
          />
          <Text
            style={[
              styles.toggleButtonText,
              service.isActive
                ? styles.deactivateButtonText
                : styles.activateButtonText,
            ]}
          >
            {service.isActive ? 'Deactivate' : 'Activate'}
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
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  titleGroup: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  category: {
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
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
    paddingVertical: 12,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metaText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
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
