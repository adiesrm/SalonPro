
import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import StaffScreen from '../screens/StaffScreen';
import CustomersScreen from '../screens/CustomersScreen';
import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Bookings: undefined;
  Services: undefined;
  Staff: undefined;
  Customers: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
   <Stack.Navigator
  screenOptions={{
    headerShown: false,
  }}
>
  {user ? (
    <>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Stack.Screen
        name="Bookings"
        component={BookingsScreen}
      />

      <Stack.Screen
        name="Services"
        component={ServicesScreen}
      />

      <Stack.Screen
        name="Staff"
        component={StaffScreen}
      />

      <Stack.Screen
        name="Customers"
        component={CustomersScreen}
      />
    </>
  ) : (
    <Stack.Screen
      name="Login"
      component={LoginScreen}
    />
  )}
</Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}