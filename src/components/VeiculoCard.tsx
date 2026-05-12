import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';
import { StatusVeiculo, Veiculo } from '../types/veiculo';

interface Props {
  veiculo: Veiculo;
  onPress: (veiculo: Veiculo) => void;
}

const statusLabel: Record<StatusVeiculo, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
};

const fallbackImage =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80';

export function VeiculoCard({ veiculo, onPress }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const statusColor: Record<StatusVeiculo, string> = {
    available: theme.colors.success,
    reserved: theme.colors.primary,
    sold: theme.colors.danger,
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(veiculo.preco);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(veiculo)}
      activeOpacity={0.86}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: veiculo.imagem || fallbackImage }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.imageOverlay} />

        <View style={styles.topInfo}>
          <Text style={styles.brand}>{veiculo.marca.toUpperCase()}</Text>

          <View
            style={[
              styles.badge,
              { backgroundColor: statusColor[veiculo.status] + '22' },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor[veiculo.status] },
              ]}
            />
            <Text
              style={[
                styles.badgeText,
                { color: statusColor[veiculo.status] },
              ]}
            >
              {statusLabel[veiculo.status]}
            </Text>
          </View>
        </View>

        <View style={styles.heroText}>
          <Text style={styles.name} numberOfLines={1}>
            {veiculo.nome}
          </Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Spec label="Ano" value={String(veiculo.ano)} />
        <View style={styles.divider} />
        <Spec label="Motor" value={veiculo.motor} />
        <View style={styles.divider} />
        <Spec label="0-100" value={veiculo.aceleracao} />
      </View>
    </TouchableOpacity>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.spec}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    imageBox: {
      height: 220,
      position: 'relative',
      backgroundColor: theme.colors.background,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.30)',
    },
    topInfo: {
      position: 'absolute',
      top: theme.spacing.md,
      left: theme.spacing.md,
      right: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    brand: {
      flex: 1,
      fontSize: 12,
      color: '#ffffffcc',
      fontWeight: '900',
      letterSpacing: 1.8,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 999,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '900',
    },
    heroText: {
      position: 'absolute',
      left: theme.spacing.md,
      right: theme.spacing.md,
      bottom: theme.spacing.md,
    },
    name: {
      fontSize: theme.font.xl,
      fontWeight: '900',
      color: '#ffffff',
      letterSpacing: -0.5,
    },
    price: {
      fontSize: theme.font.lg,
      fontWeight: '900',
      color: theme.colors.primary,
      marginTop: 4,
    },
    body: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    spec: {
      flex: 1,
      gap: 4,
    },
    specLabel: {
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    specValue: {
      color: theme.colors.text,
      fontSize: theme.font.sm,
      fontWeight: '800',
    },
    divider: {
      width: 1,
      height: 32,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.sm,
    },
  });
}