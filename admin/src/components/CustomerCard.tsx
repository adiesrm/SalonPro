import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Customer } from '../services/customerService';

interface Props {
  customer: Customer;
}

export default function CustomerCard({ customer }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{customer.fullName}</Text>

      <Text>{customer.phone}</Text>

      <Text>{customer.email}</Text>

      <Text>Bookings: {customer.totalBookings}</Text>

      <Text>{customer.isActive ? 'Active' : 'Inactive'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});