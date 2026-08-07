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
import { Ionicons } from '@expo/vector-icons';

import ServiceCard from '../components/ServiceCard';
import ServiceFormModal from '../components/ServiceFormModal';
import {
  addService,
  getServices,
  toggleServiceStatus,
  updateService,
  type Service,
  type ServiceFormValues,
} from '../services/serviceService';

export default function ServicesScreen(): React.JSX.Element {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getServices();
      setServices(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load services. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter((service) =>
      service.name.toLowerCase().includes(query)
    );
  }, [searchQuery, services]);

  const handleAddPress = () => {
    setEditingService(null);
    setIsFormVisible(true);
  };

  const handleEditPress = (service: Service) => {
    setEditingService(service);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    if (isSaving) {
      return;
    }

    setIsFormVisible(false);
    setEditingService(null);
  };

  const handleSubmitService = async (values: ServiceFormValues) => {
    try {
      setIsSaving(true);
      setError(null);

      if (editingService) {
        await updateService(editingService.id, values);
      } else {
        await addService(values);
      }

      setIsFormVisible(false);
      setEditingService(null);
      await loadServices();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save service. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      setError(null);

      await toggleServiceStatus(service.id, !service.isActive);
      setServices((currentServices) =>
        currentServices.map((currentService) =>
          currentService.id === service.id
            ? { ...currentService, isActive: !service.isActive }
            : currentService
        )
      );
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'Unable to update service status. Please try again.'
      );
    }
  };

  if (isLoading && services.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading services...</Text>
      </View>
    );
  }

  if (error && services.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Could not load services</Text>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={setSearchQuery}
        placeholder="Search services by name..."
        placeholderTextColor="#94A3B8"
        style={styles.searchInput}
        value={searchQuery}
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
        contentContainerStyle={
          filteredServices.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        data={filteredServices}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim()
                ? 'No matching services found'
                : 'No services found'}
            </Text>

            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Try searching for a different service name.'
                : 'Add your first service to start building the salon menu.'}
            </Text>
          </View>
        }
        onRefresh={loadServices}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <ServiceCard
            onEdit={handleEditPress}
            onToggleStatus={handleToggleStatus}
            service={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        accessibilityLabel="Add service"
        accessibilityRole="button"
        activeOpacity={0.85}
        onPress={handleAddPress}
        style={styles.fab}
      >
        <Ionicons color="#FFFFFF" name="add" size={28} />
      </TouchableOpacity>

      <ServiceFormModal
        initialValues={editingService}
        isSubmitting={isSaving}
        onClose={handleCloseForm}
        onSubmit={handleSubmitService}
        visible={isFormVisible}
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

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 15,
    height: 48,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },

  listContent: {
    paddingBottom: 96,
    paddingVertical: 4,
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
    marginBottom: 10,
    marginHorizontal: 16,
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

  fab: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 30,
    bottom: 24,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    width: 60,
  },
});
