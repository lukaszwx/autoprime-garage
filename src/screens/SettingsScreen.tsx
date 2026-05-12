import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SectionHeader } from '../components/SectionHeader';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/navigationTypes';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState(true);

  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja encerrar sua sessão?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.back}>Voltar</Text>
        </TouchableOpacity>

        <SectionHeader title="Configurações" />
        <Text style={styles.headerSub}>
          Controle sua experiência, preferências e dados do AutoPrime.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>AP</Text>
          </View>

          <Text style={styles.appName}>AUTOPRIME</Text>
          <Text style={styles.appSub}>Garage</Text>

          <View style={styles.versionPill}>
            <Text style={styles.version}>Versão 1.0.0</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Preferências</Text>
            <Text style={styles.sectionTag}>App</Text>
          </View>

          <SettingSwitchItem
            theme={theme}
            title="Notificações"
            description="Avisos sobre reservas, status e atualizações."
            value={notifications}
            onChange={setNotifications}
          />

          <View style={styles.divider} />

          <SettingSwitchItem
            theme={theme}
            title="Modo escuro"
            description="Visual premium para uso noturno."
            value={isDark}
            onChange={toggleTheme}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Sistema</Text>
            <Text style={styles.sectionTag}>Status</Text>
          </View>

          <InfoRow theme={theme} label="Banco de dados" value="Supabase" />
          <View style={styles.divider} />
          <InfoRow theme={theme} label="Persistência" value="Ativa" />
          <View style={styles.divider} />
          <InfoRow theme={theme} label="Catálogo" value="Veículos premium" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.about}>
            Aplicativo desenvolvido como trabalho de Programação Mobile.
            Catálogo e gerenciamento de veículos premium com persistência
            integrada usando Supabase.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingSwitchItemProps = {
  theme: AppTheme;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function SettingSwitchItem({
  theme,
  title,
  description,
  value,
  onChange,
}: SettingSwitchItemProps) {
  const styles = createStyles(theme);

  return (
    <View style={styles.item}>
      <View style={styles.itemTextBox}>
        <Text style={styles.itemLabel}>{title}</Text>
        <Text style={styles.itemSub}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.text}
      />
    </View>
  );
}

type InfoRowProps = {
  theme: AppTheme;
  label: string;
  value: string;
};

function InfoRow({ theme, label, value }: InfoRowProps) {
  const styles = createStyles(theme);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    backButton: {
      alignSelf: 'flex-start',
      paddingVertical: 4,
      paddingRight: theme.spacing.md,
    },
    back: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '700',
    },
    headerSub: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      lineHeight: 20,
    },
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xl * 2,
    },
    heroCard: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },
    logoBadge: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    logoText: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: '900',
      letterSpacing: 2,
    },
    appName: {
      fontSize: 26,
      fontWeight: '900',
      color: theme.colors.text,
      letterSpacing: 4,
    },
    appSub: {
      fontSize: theme.font.md,
      fontWeight: '400',
      color: theme.colors.primary,
      letterSpacing: 2,
      marginTop: 2,
    },
    versionPill: {
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    version: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      fontWeight: '600',
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    sectionTag: {
      fontSize: theme.font.sm,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    itemTextBox: {
      flex: 1,
    },
    itemLabel: {
      fontSize: theme.font.md,
      color: theme.colors.text,
      fontWeight: '700',
    },
    itemSub: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: 4,
      lineHeight: 18,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    infoLabel: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      fontWeight: '600',
    },
    infoValue: {
      color: theme.colors.text,
      fontSize: theme.font.sm,
      fontWeight: '800',
    },
    about: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      lineHeight: 21,
    },
    logoutBtn: {
      borderWidth: 1,
      borderColor: theme.colors.danger,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    logoutText: {
      color: theme.colors.danger,
      fontSize: theme.font.md,
      fontWeight: '800',
    },
  });
}