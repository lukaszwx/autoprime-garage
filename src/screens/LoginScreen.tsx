import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { PremiumButton } from '../components/PremiumButton';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';
import { authService } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    const result = await authService.login(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }

    setError('');
    navigation.replace('Home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>AUTOPRIME</Text>
          <Text style={styles.tagline}>Garage</Text>
          <Text style={styles.subtitle}>Acervo de veículos</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor={theme.colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={theme.colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PremiumButton label="Entrar" onPress={handleLogin} />

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    header: {
      marginBottom: theme.spacing.xl * 1.5,
    },
    logo: {
      fontSize: 36,
      fontWeight: '900',
      color: theme.colors.text,
      letterSpacing: 4,
    },
    tagline: {
      fontSize: theme.font.xl,
      fontWeight: '300',
      color: theme.colors.primary,
      letterSpacing: 2,
      marginTop: -4,
    },
    subtitle: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: theme.spacing.sm,
    },
    form: {
      gap: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.font.md,
    },
    error: {
      color: theme.colors.danger,
      fontSize: theme.font.sm,
      marginTop: -4,
    },
    registerBtn: {
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    registerText: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '600',
    },
  });
}
