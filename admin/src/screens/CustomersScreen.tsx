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

import CustomerCard from '../components/CustomerCard';
import {
  getCustomers,
  type Customer,
} from '../services/customerService';

export default function CustomersScreen(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getCustomers();
      setCustomers(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load customers. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.fullName.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, searchQuery]);

  if (isLoading && customers.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading customers...</Text>
      </View>
    );
  }

  if (error && customers.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Could not load customers</Text>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadCustomers}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search name, phone or email..."
        placeholderTextColor="#94A3B8"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
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
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadCustomers}
        contentContainerStyle={
          filteredCustomers.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim()
                ? 'No matching customers found'
                : 'No customers found'}
            </Text>

            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Try searching with a different name, phone number, or email.'
                : 'Customers will appear here when they are added to the salon.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => <CustomerCard customer={item} />}
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
