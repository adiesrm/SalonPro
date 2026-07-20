import React from 'react';
import {
  View,
 Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { logout } from '../services/authService';

export default function DashboardScreen() {
  async function handleLogout() {
    try {
      await logout();

      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SalonPro Admin Dashboard</Text>

      <Text style={styles.subtitle}>
        Welcome, Admin 🎉
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },

  button: {
    backgroundColor: '#E53935',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});