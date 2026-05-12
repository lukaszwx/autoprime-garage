import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { VeiculoCard } from '../components/VeiculoCard';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/navigationTypes';
import { veiculoService } from '../services/veiculoService';
import { AppTheme } from '../styles/theme';
import { StatusVeiculo, Veiculo } from '../types/veiculo';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type FilterStatus = 'all' | StatusVeiculo;

const filters: { label: string; value: FilterStatus }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Disponíveis', value: 'available' },
  { label: 'Reservados', value: 'reserved' },
  { label: 'Vendidos', value: 'sold' },
];

export function HomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const styles = createStyles(theme, isCompact);

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    const available = veiculos.filter((item) => item.status === 'available').length;
    const reserved = veiculos.filter((item) => item.status === 'reserved').length;
    const sold = veiculos.filter((item) => item.status === 'sold').length;

    return {
      total: veiculos.length,
      available,
      reserved,
      sold,
    };
  }, [veiculos]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return veiculos.filter((veiculo) => {
      const matchesSearch =
        !normalizedQuery ||
        veiculo.nome.toLowerCase().includes(normalizedQuery) ||
        veiculo.marca.toLowerCase().includes(normalizedQuery) ||
        String(veiculo.ano).includes(normalizedQuery);

      const matchesStatus =
        activeFilter === 'all' || veiculo.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [veiculos, query, activeFilter]);

  async function loadCars(options?: { refresh?: boolean }) {
    try {
      setError('');

      if (options?.refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const nextCars = await veiculoService.listarVeiculos();
      setVeiculos(nextCars);
    } catch {
      setError('Não foi possível carregar os veículos.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function safeLoad() {
        try {
          setError('');
          setIsLoading(true);

          const nextCars = await veiculoService.listarVeiculos();

          if (isActive) {
            setVeiculos(nextCars);
          }
        } catch {
          if (isActive) {
            setError('Não foi possível carregar os veículos.');
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      safeLoad();

      return () => {
        isActive = false;
      };
    }, [])
  );

  function clearSearch() {
    setQuery('');
    setActiveFilter('all');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandWrapper}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogoBox}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>AutoPrime</Text>
              <Text style={styles.brandSubtitle}>Premium Garage</Text>
            </View>
          </View>

          <Text style={styles.brandDescription}>
            {stats.total} veículo{stats.total !== 1 ? 's' : ''} no acervo
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dashboardCard}>
        <View>
          <Text style={styles.dashboardLabel}>Acervo premium</Text>
          <Text style={styles.dashboardValue}>{stats.total}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.available}</Text>
            <Text style={styles.statLabel}>Disp.</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.reserved}</Text>
            <Text style={styles.statLabel}>Reserv.</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.sold}</Text>
            <Text style={styles.statLabel}>Vend.</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por nome, marca ou ano..."
          placeholderTextColor={theme.colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />

        {query ? (
          <TouchableOpacity activeOpacity={0.75} onPress={() => setQuery('')}>
            <Text style={styles.clearSearch}>Limpar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filtersRow}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <TouchableOpacity
              key={filter.value}
              activeOpacity={0.8}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.retryBtn}
            onPress={() => loadCars()}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando garagem...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VeiculoCard
              veiculo={item}
              onPress={(veiculo) =>
                navigation.navigate('CarDetails', { carId: veiculo.id })
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadCars({ refresh: true })}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nenhum veículo encontrado</Text>
              <Text style={styles.empty}>
                Ajuste a busca ou cadastre um novo veículo no acervo.
              </Text>

              {query || activeFilter !== 'all' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.emptyAction}
                  onPress={clearSearch}
                >
                  <Text style={styles.emptyActionText}>Limpar filtros</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
        />
      )}

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

function createStyles(theme: AppTheme, isCompact: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: isCompact ? theme.spacing.sm : theme.spacing.md,
      paddingTop: isCompact ? theme.spacing.sm : theme.spacing.md,
      gap: theme.spacing.sm,
    },

    brandWrapper: {
      flex: 1,
    },

    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    brandLogoBox: {
      width: 62,
      height: 62,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.primarySoft,
      ...theme.shadow.md,
    },

    brandLogo: {
      width: 42,
      height: 42,
    },

    brandText: {
      gap: 2,
    },

    brandTitle: {
      color: theme.colors.text,
      fontSize: isCompact ? theme.font.xl : theme.font.xxl,
      fontWeight: '900',
      letterSpacing: -1,
    },

    brandSubtitle: {
      color: theme.colors.primary,
      fontSize: theme.font.sm,
      fontWeight: '800',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },

    brandDescription: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      marginTop: theme.spacing.sm,
      lineHeight: 20,
    },

    settingsBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    settingsIcon: {
      fontSize: 20,
      color: theme.colors.text,
    },

    dashboardCard: {
      marginHorizontal: isCompact ? theme.spacing.sm : theme.spacing.md,
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderSoft,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
      ...theme.shadow.sm,
    },

    dashboardLabel: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    dashboardValue: {
      color: theme.colors.text,
      fontSize: isCompact ? 30 : 36,
      fontWeight: '900',
      marginTop: 2,
    },

    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    statItem: {
      minWidth: isCompact ? 48 : 58,
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    statValue: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '900',
    },

    statLabel: {
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: '700',
      marginTop: 2,
    },

    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      marginHorizontal: isCompact ? theme.spacing.sm : theme.spacing.md,
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },

    search: {
      flex: 1,
      paddingVertical: isCompact ? theme.spacing.sm : theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.font.md,
    },

    clearSearch: {
      color: theme.colors.primary,
      fontSize: theme.font.sm,
      fontWeight: '800',
    },

    filtersRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingHorizontal: isCompact ? theme.spacing.sm : theme.spacing.md,
      marginTop: theme.spacing.md,
    },

    filterChip: {
      paddingVertical: 8,
      paddingHorizontal: isCompact ? 10 : 12,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },

    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    filterText: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      fontWeight: '800',
    },

    filterTextActive: {
      color: theme.colors.background,
    },

    errorBox: {
      marginHorizontal: isCompact ? theme.spacing.sm : theme.spacing.md,
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.danger,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },

    errorText: {
      color: theme.colors.danger,
      fontSize: theme.font.sm,
      fontWeight: '700',
    },

    retryBtn: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.danger,
    },

    retryText: {
      color: theme.colors.background,
      fontSize: theme.font.sm,
      fontWeight: '800',
    },

    loadingBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },

    loadingText: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      fontWeight: '700',
    },

    list: {
      paddingHorizontal: isCompact ? theme.spacing.sm : theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: 110,
    },

    emptyBox: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl * 2,
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },

    emptyTitle: {
      color: theme.colors.text,
      fontSize: theme.font.md,
      fontWeight: '900',
      textAlign: 'center',
    },

    empty: {
      color: theme.colors.muted,
      textAlign: 'center',
      fontSize: theme.font.sm,
      lineHeight: 20,
    },

    emptyAction: {
      marginTop: theme.spacing.sm,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
    },

    emptyActionText: {
      color: theme.colors.background,
      fontSize: theme.font.sm,
      fontWeight: '900',
    },

    fab: {
      position: 'absolute',
      bottom: isCompact ? 20 : 28,
      right: isCompact ? 16 : 24,
      width: 58,
      height: 58,
      borderRadius: 29,
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
      fontSize: 30,
      color: theme.colors.background,
      fontWeight: '300',
      lineHeight: 34,
    },
  });
}