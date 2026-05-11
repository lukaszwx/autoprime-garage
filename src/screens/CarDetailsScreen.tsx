import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { PremiumButton } from '../components/PremiumButton';
import { carService } from '../services/carService';
import { Car, CarStatus } from '../types/car';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CarDetails'>;

const statusLabel: Record<CarStatus, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
};

const fallbackImage =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

export function CarDetailsScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const statusColor: Record<CarStatus, string> = {
    available: theme.colors.success,
    reserved: theme.colors.primary,
    sold: theme.colors.muted,
  };
  const { carId } = route.params;
  const [car, setCar] = useState<Car | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadCar() {
      const nextCar = await carService.getById(carId);
      if (isActive) {
        setCar(nextCar);
        setIsLoading(false);
      }
    }

    loadCar();

    return () => {
      isActive = false;
    };
  }, [carId]);

  if (isLoading) {
    return <SafeAreaView style={styles.container} />;
  }

  if (!car) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Veículo não encontrado.</Text>
      </View>
    );
  }

  async function handleReserve() {
    if (!car) return;
    const updated = await carService.updateStatus(car.id, 'reserved');
    if (updated) setCar({ ...updated });
  }

  function handleDelete() {
    Alert.alert(
      'Excluir veículo',
      `Confirma a exclusão do ${car?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await carService.deleteCar(car!.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(car.price);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: car.imageUrl || fallbackImage }}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.brand}>{car.brand.toUpperCase()}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: statusColor[car.status] + '22' },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: statusColor[car.status] }]}
              >
                {statusLabel[car.status]}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{car.name}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>

          <View style={styles.specs}>
            <Spec label="Ano" value={String(car.year)} />
            <Spec label="Motor" value={car.engine} />
            <Spec label="0–100 km/h" value={car.acceleration} />
          </View>

          <Text style={styles.description}>{car.description}</Text>

          <View style={styles.actions}>
            <PremiumButton
              label="Reservar veículo"
              onPress={handleReserve}
              style={{ flex: 1 }}
            />
            <PremiumButton
              label="Excluir"
              onPress={handleDelete}
              variant="danger"
              style={{ flex: 0, paddingHorizontal: 20 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  const specStyles = createSpecStyles(theme);

  return (
    <View style={specStyles.item}>
      <Text style={specStyles.label}>{label}</Text>
      <Text style={specStyles.value}>{value}</Text>
    </View>
  );
}

function createSpecStyles(theme: AppTheme) {
  return StyleSheet.create({
    item: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.sm,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      fontSize: 11,
      color: theme.colors.muted,
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    value: {
      fontSize: theme.font.md,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
    },
  });
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notFound: {
      color: theme.colors.muted,
      fontSize: theme.font.md,
    },
    image: {
      width: '100%',
      height: 280,
    },
    backBtn: {
      position: 'absolute',
      top: 16,
      left: 16,
      backgroundColor: theme.colors.background + 'cc',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      fontSize: 20,
      color: theme.colors.text,
    },
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brand: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      fontWeight: '600',
      letterSpacing: 1.5,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    name: {
      fontSize: theme.font.xxl,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: -0.5,
      marginTop: -8,
    },
    price: {
      fontSize: theme.font.xl,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    specs: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    description: {
      fontSize: theme.font.md,
      color: theme.colors.muted,
      lineHeight: 22,
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
  });
}
