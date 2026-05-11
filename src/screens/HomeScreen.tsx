import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { CarCard } from '../components/CarCard';
import { SectionHeader } from '../components/SectionHeader';
import { carService } from '../services/carService';
import { Car } from '../types/car';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [cars, setCars] = useState<Car[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadCars() {
        const nextCars = await carService.listCars();
        if (isActive) {
          setCars(nextCars);
        }
      }

      loadCars();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const filtered = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <SectionHeader
          title="AutoPrime Garage"
          subtitle={`${cars.length} veículo${cars.length !== 1 ? 's' : ''} no acervo`}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar por nome ou marca..."
        placeholderTextColor={theme.colors.muted}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={(car) =>
              navigation.navigate('CarDetails', { carId: car.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum veículo encontrado.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddCar')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    settingsBtn: {
      padding: theme.spacing.sm,
    },
    settingsIcon: {
      fontSize: 22,
      color: theme.colors.muted,
    },
    search: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.font.md,
    },
    list: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: 100,
    },
    empty: {
      color: theme.colors.muted,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      fontSize: theme.font.md,
    },
    fab: {
      position: 'absolute',
      bottom: 28,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    fabIcon: {
      fontSize: 28,
      color: theme.colors.background,
      fontWeight: '300',
      lineHeight: 32,
    },
  });
}
