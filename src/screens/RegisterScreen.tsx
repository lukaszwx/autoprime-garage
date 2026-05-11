import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PremiumButton } from '../components/PremiumButton';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/navigationTypes';
import { authService } from '../services/authService';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setSuccess('');
      setError('Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setSuccess('');
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setSuccess('');
      setError('As senhas não coincidem.');
      return;
    }

    const result = await authService.register({
      name,
      email,
      password,
    });

    if (result.error) {
      setSuccess('');
      setError(result.error);
      return;
    }

    setError('');
    setSuccess('Conta criada com sucesso. Faça login para continuar.');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      navigation.goBack();
    }, 700);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre um acesso local para entrar no app</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={theme.colors.muted}
            value={name}
            onChangeText={setName}
          />
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
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor={theme.colors.muted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <PremiumButton label="Cadastrar" onPress={handleRegister} />
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
    backBtn: {
      position: 'absolute',
      top: 56,
      left: theme.spacing.xl,
    },
    backText: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '600',
    },
    header: {
      marginBottom: theme.spacing.xl * 1.5,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: -0.5,
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
    success: {
      color: theme.colors.success,
      fontSize: theme.font.sm,
      marginTop: -4,
    },
  });
}
