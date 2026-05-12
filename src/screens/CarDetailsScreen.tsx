import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/navigationTypes';
import { veiculoService } from '../services/veiculoService';
import { AppTheme } from '../styles/theme';
import { StatusVeiculo, Veiculo } from '../types/veiculo';

type Props = NativeStackScreenProps<RootStackParamList, 'CarDetails'>;

const statusLabel: Record<StatusVeiculo, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
};

const fallbackImage =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80';

export function CarDetailsScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { carId } = route.params;

  const [veiculo, setVeiculo] = useState<Veiculo | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const statusColor: Record<StatusVeiculo, string> = {
    available: theme.colors.success,
    reserved: theme.colors.primary,
    sold: theme.colors.danger,
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadVeiculo() {
        try {
          setIsLoading(true);

          const nextCar = await veiculoService.obterVeiculoPorId(carId);

          if (isActive) {
            setVeiculo(nextCar);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadVeiculo();

      return () => {
        isActive = false;
      };
    }, [carId])
  );

  async function handleReserve() {
    if (!veiculo || isActionLoading) return;

    if (veiculo.status === 'sold') {
      Alert.alert(
        'Veículo indisponível',
        'Este veículo já foi vendido.'
      );
      return;
    }

    try {
      setIsActionLoading(true);

      const nextStatus: StatusVeiculo =
        veiculo.status === 'reserved'
          ? 'available'
          : 'reserved';

      const updated =
        await veiculoService.atualizarStatusVeiculo(
          veiculo.id,
          nextStatus
        );

      if (!updated) {
        Alert.alert(
          'Erro',
          'Não foi possível atualizar o status.'
        );
        return;
      }

      setVeiculo(updated);

      Alert.alert(
        nextStatus === 'reserved'
          ? 'Reserva realizada'
          : 'Reserva removida',
        nextStatus === 'reserved'
          ? 'O veículo foi reservado com sucesso.'
          : 'O veículo voltou para disponível.'
      );
    } catch {
      Alert.alert(
        'Erro',
        'Falha ao conectar com o banco de dados.'
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  function handleEdit() {
    if (!veiculo || isActionLoading) return;

    navigation.navigate('EditCar', {
      carId: veiculo.id,
    });
  }

  function handleDelete() {
    if (!veiculo || isActionLoading) return;

    Alert.alert(
      'Excluir veículo',
      `Deseja realmente excluir ${veiculo.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsActionLoading(true);

              const deleted =
                await veiculoService.excluirVeiculo(
                  veiculo.id
                );

              if (!deleted) {
                Alert.alert(
                  'Erro',
                  'Não foi possível excluir o veículo.'
                );
                return;
              }

              Alert.alert(
                'Veículo removido',
                'O veículo foi excluído com sucesso.'
              );

              navigation.goBack();
            } catch {
              Alert.alert(
                'Erro',
                'Falha ao conectar com o banco.'
              );
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ]
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          Carregando veículo...
        </Text>
      </SafeAreaView>
    );
  }

  if (!veiculo) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notFound}>
          Veículo não encontrado.
        </Text>
      </SafeAreaView>
    );
  }

  const formattedPrice = new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }
  ).format(veiculo.preco);

  const reserveLabel =
    veiculo.status === 'reserved'
      ? 'Cancelar reserva'
      : 'Reservar';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Image
            source={{
              uri: veiculo.imagem || fallbackImage,
            }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.imageOverlay} />

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.heroBrand}>
              {veiculo.marca.toUpperCase()}
            </Text>

            <Text style={styles.heroTitle}>
              {veiculo.nome}
            </Text>

            <Text style={styles.heroPrice}>
              {formattedPrice}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusColor[veiculo.status] + '22',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    statusColor[veiculo.status],
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    statusColor[veiculo.status],
                },
              ]}
            >
              {statusLabel[veiculo.status]}
            </Text>
          </View>

          <View style={styles.specs}>
            <Spec label="Ano" value={String(veiculo.ano)} />
            <Spec label="Motor" value={veiculo.motor} />
            <Spec
              label="0-100 km/h"
              value={veiculo.aceleracao}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sobre o veículo
            </Text>

            <Text style={styles.description}>
              {veiculo.descricao}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              disabled={
                isActionLoading ||
                veiculo.status === 'sold'
              }
              onPress={handleReserve}
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isActionLoading) &&
                  styles.disabledButton,
                veiculo.status === 'sold' &&
                  styles.disabledButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isActionLoading
                  ? 'Processando...'
                  : reserveLabel}
              </Text>
            </Pressable>

            <View style={styles.secondaryActions}>
              <Pressable
                disabled={isActionLoading}
                onPress={handleEdit}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  (pressed || isActionLoading) &&
                    styles.disabledButton,
                ]}
              >
                <Text style={styles.secondaryButtonText}>
                  Editar
                </Text>
              </Pressable>

              <Pressable
                disabled={isActionLoading}
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.deleteButton,
                  (pressed || isActionLoading) &&
                    styles.disabledButton,
                ]}
              >
                <Text style={styles.deleteButtonText}>
                  Excluir
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Spec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { theme } = useTheme();
  const styles = createSpecStyles(theme);

  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function createSpecStyles(theme: AppTheme) {
  return StyleSheet.create({
    item: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      fontSize: 11,
      color: theme.colors.muted,
      marginBottom: 6,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    value: {
      fontSize: theme.font.md,
      fontWeight: '800',
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

    loadingContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },

    loadingText: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      fontWeight: '700',
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

    hero: {
      position: 'relative',
      height: 360,
    },

    image: {
      width: '100%',
      height: '100%',
    },

    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },

    heroContent: {
      position: 'absolute',
      bottom: 24,
      left: 20,
      right: 20,
    },

    heroBrand: {
      color: '#ffffffcc',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 2,
      marginBottom: 6,
    },

    heroTitle: {
      color: '#ffffff',
      fontSize: 34,
      fontWeight: '900',
      letterSpacing: -1,
    },

    heroPrice: {
      color: theme.colors.primary,
      fontSize: 28,
      fontWeight: '900',
      marginTop: 6,
    },

    backBtn: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderRadius: 22,
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },

    backIcon: {
      fontSize: 32,
      color: '#ffffff',
      marginTop: -3,
    },

    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.lg,
      paddingBottom: 40,
    },

    statusBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      gap: 8,
    },

    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },

    statusText: {
      fontSize: 13,
      fontWeight: '800',
    },

    specs: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    section: {
      gap: theme.spacing.sm,
    },

    sectionTitle: {
      fontSize: theme.font.md,
      fontWeight: '900',
      color: theme.colors.text,
    },

    description: {
      fontSize: theme.font.md,
      color: theme.colors.muted,
      lineHeight: 24,
    },

    actions: {
      gap: theme.spacing.md,
    },

    primaryButton: {
      height: 54,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    primaryButtonText: {
      color: '#020617',
      fontSize: theme.font.md,
      fontWeight: '900',
    },

    secondaryActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    secondaryButton: {
      flex: 1,
      height: 50,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },

    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: theme.font.md,
      fontWeight: '800',
    },

    deleteButton: {
      flex: 1,
      height: 50,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.danger,
    },

    deleteButtonText: {
      color: '#ffffff',
      fontSize: theme.font.md,
      fontWeight: '800',
    },

    disabledButton: {
      opacity: 0.65,
    },
  });
}