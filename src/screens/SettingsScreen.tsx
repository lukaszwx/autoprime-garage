import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { SectionHeader } from '../components/SectionHeader';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState(true);

  function handleLogout() {
    
    navigation.replace('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}> Voltar</Text>
        </TouchableOpacity>
        <SectionHeader title="Configurações" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>AUTOPRIME</Text>
          <Text style={styles.appSub}>Garage</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Notificações</Text>
              <Text style={styles.itemSub}>Avisos sobre reservas e atualizações</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.text}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Modo escuro</Text>
              <Text style={styles.itemSub}>Tema visual da interface</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.about}>
            Aplicativo desenvolvido como trabalho de Programação Mobile.
            Catálogo e gerenciamento de veículos premium com suporte futuro ao Firebase.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    back: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xl * 2,
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },
    appName: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.text,
      letterSpacing: 4,
    },
    appSub: {
      fontSize: theme.font.md,
      fontWeight: '300',
      color: theme.colors.primary,
      letterSpacing: 2,
    },
    version: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: theme.spacing.sm,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemLabel: {
      fontSize: theme.font.md,
      color: theme.colors.text,
      fontWeight: '500',
    },
    itemSub: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },
    about: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      lineHeight: 20,
    },
    logoutBtn: {
      borderWidth: 1,
      borderColor: theme.colors.danger,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    logoutText: {
      color: theme.colors.danger,
      fontSize: theme.font.md,
      fontWeight: '600',
    },
  });
}
