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

import StaffCard from '../components/StaffCard';
import StaffFormModal from '../components/StaffFormModal';
import {
  addBarber,
  getBarbers,
  toggleBarberStatus,
  updateBarber,
  type Barber,
  type BarberFormValues,
} from '../services/barberService';

export default function StaffScreen(): React.JSX.Element {
  const [staff, setStaff] = useState<Barber[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Barber | null>(null);

  const loadStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getBarbers();
      setStaff(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load staff. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  const filteredStaff = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return staff;
    }

    return staff.filter((barber) =>
      barber.name.toLowerCase().includes(query)
    );
  }, [searchQuery, staff]);

  const handleAddPress = () => {
    setEditingStaff(null);
    setIsFormVisible(true);
  };

  const handleEditPress = (barber: Barber) => {
    setEditingStaff(barber);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    if (isSaving) {
      return;
    }

    setIsFormVisible(false);
    setEditingStaff(null);
  };

  const handleSubmitStaff = async (values: BarberFormValues) => {
    try {
      setIsSaving(true);
      setError(null);

      if (editingStaff) {
        await updateBarber(editingStaff.id, values);
      } else {
        await addBarber(values);
      }

      setIsFormVisible(false);
      setEditingStaff(null);
      await loadStaff();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save staff. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (barber: Barber) => {
    try {
      setError(null);

      await toggleBarberStatus(barber.id, !barber.isActive);
      setStaff((currentStaff) =>
        currentStaff.map((currentBarber) =>
          currentBarber.id === barber.id
            ? { ...currentBarber, isActive: !barber.isActive }
            : currentBarber
        )
      );
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'Unable to update staff status. Please try again.'
      );
    }
  };

  if (isLoading && staff.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading staff...</Text>
      </View>
    );
  }

  if (error && staff.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Could not load staff</Text>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadStaff}>
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
        placeholder="Search staff by name..."
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
          filteredStaff.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim()
                ? 'No matching staff found'
                : 'No staff found'}
            </Text>

            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Try searching for a different staff name.'
                : 'Add your first barber to start building the team.'}
            </Text>
          </View>
        }
        onRefresh={loadStaff}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <StaffCard
            barber={item}
            onEdit={handleEditPress}
            onToggleStatus={handleToggleStatus}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        accessibilityLabel="Add staff"
        accessibilityRole="button"
        activeOpacity={0.85}
        onPress={handleAddPress}
        style={styles.fab}
      >
        <Ionicons color="#FFFFFF" name="add" size={28} />
      </TouchableOpacity>

      <StaffFormModal
        initialValues={editingStaff}
        isSubmitting={isSaving}
        onClose={handleCloseForm}
        onSubmit={handleSubmitStaff}
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
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
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
