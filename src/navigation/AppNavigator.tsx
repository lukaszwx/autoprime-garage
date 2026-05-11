import React from 'react';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { theme, navigationTheme } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
        <Stack.Screen name="AddCar" component={AddCarScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
