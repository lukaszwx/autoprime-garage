import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigationTypes';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CarDetailsScreen } from '../screens/CarDetailsScreen';
import { AddCarScreen } from '../screens/AddCarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { theme, navigationTheme } = useTheme();

  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function checkSession() {
      const session = await authService.getSession();
      setInitialRoute(session ? 'Home' : 'Login');
    }

    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

        <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
        <Stack.Screen name="AddCar" component={AddCarScreen} />
        <Stack.Screen name="EditCar" component={AddCarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});