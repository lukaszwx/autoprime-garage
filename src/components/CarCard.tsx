import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Car, CarStatus } from '../types/car';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

interface Props {
  car: Car;
  onPress: (car: Car) => void;
}

const statusLabel: Record<CarStatus, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
};

const fallbackImage =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

export function CarCard({ car, onPress }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const statusColor: Record<CarStatus, string> = {
    available: theme.colors.success,
    reserved: theme.colors.primary,
    sold: theme.colors.muted,
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(car.price);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(car)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: car.imageUrl || fallbackImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.body}>
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
        <View style={styles.row}>
          <Text style={styles.year}>{car.year}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    image: {
      width: '100%',
      height: 180,
    },
    body: {
      padding: theme.spacing.md,
      gap: 6,
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
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    name: {
      fontSize: theme.font.lg,
      fontWeight: '700',
      color: theme.colors.text,
    },
    year: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
    },
    price: {
      fontSize: theme.font.md,
      fontWeight: '700',
      color: theme.colors.primary,
    },
  });
}
