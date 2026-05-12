import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PremiumButton } from '../components/PremiumButton';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/navigationTypes';
import { authService } from '../services/authService';
import { AppTheme } from '../styles/theme';
import { Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const styles = createStyles(theme, isCompact);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (!password) return { label: '', score: 0 };
    if (score <= 1) return { label: 'Senha fraca', score };
    if (score <= 3) return { label: 'Senha boa', score };

    return { label: 'Senha forte', score };
  }, [password]);

  function validateForm() {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      return 'Preencha todos os campos.';
    }

    if (normalizedName.length < 2) {
      return 'Informe um nome válido.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return 'Informe um e-mail válido.';
    }

    if (password.length < 6) {
      return 'A senha precisa ter pelo menos 6 caracteres.';
    }

    if (password !== confirmPassword) {
      return 'As senhas não coincidem.';
    }

    return '';
  }

  async function handleRegister() {
    if (isSubmitting) return;

    setSuccess('');
    setError('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess('Conta criada com sucesso. Faça login para continuar.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigation.goBack();
      }, 700);
    } catch {
      setError('Não foi possível criar sua conta agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.header}>
              <Text style={styles.eyebrow}>AutoPrime Garage</Text>
              <Text style={styles.title}>Criar conta</Text>
              <Text style={styles.subtitle}>
                Cadastre seu acesso para gerenciar veículos, reservas e
                atualizações do catálogo.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Babidi"
                  placeholderTextColor={theme.colors.muted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor={theme.colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={theme.colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setShowPassword((current) => !current)}
                  >
                    <Text style={styles.togglePassword}>
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {passwordStrength.label ? (
                  <Text style={styles.passwordHint}>
                    {passwordStrength.label}
                  </Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar senha</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Repita sua senha"
                    placeholderTextColor={theme.colors.muted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  >
                    <Text style={styles.togglePassword}>
                      {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
              {success ? <Text style={styles.success}>{success}</Text> : null}

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmitting}
                onPress={handleRegister}
              >
                {isSubmitting ? (
                  <View style={styles.loadingButton}>
                    <ActivityIndicator color={theme.colors.background} />
                    <Text style={styles.loadingText}>Criando conta...</Text>
                  </View>
                ) : (
                  <PremiumButton label="Cadastrar" onPress={handleRegister} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.loginHint}>
                  Já tem conta? Entrar agora
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: AppTheme, isCompact: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: isCompact ? theme.spacing.md : theme.spacing.xl,
      minHeight: '100%',
    },
    backBtn: {
      position: 'absolute',
      top: isCompact ? 24 : 56,
      left: isCompact ? theme.spacing.md : theme.spacing.xl,
      zIndex: 2,
    },
    backText: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '700',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: isCompact ? theme.spacing.md : theme.spacing.lg,
    },
    logo: {
      width: 80,
      height: 80,
      alignSelf: 'center',
      marginBottom: theme.spacing.lg,
    },
    brandBadge: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: theme.spacing.lg,
    },
    brandBadgeText: {
      color: theme.colors.primary,
      fontSize: 18,
      fontWeight: '900',
      letterSpacing: 2,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontSize: theme.font.sm,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: isCompact ? 28 : 34,
      fontWeight: '900',
      color: theme.colors.text,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: theme.spacing.sm,
      lineHeight: 21,
    },
    form: {
      gap: theme.spacing.md,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      color: theme.colors.text,
      fontSize: theme.font.sm,
      fontWeight: '700',
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.font.md,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
    },
    passwordInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: theme.font.md,
      paddingVertical: theme.spacing.md,
      paddingRight: theme.spacing.sm,
    },
    togglePassword: {
      color: theme.colors.primary,
      fontSize: theme.font.sm,
      fontWeight: '800',
    },
    passwordHint: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
    },
    error: {
      color: theme.colors.danger,
      fontSize: theme.font.sm,
      fontWeight: '700',
      lineHeight: 19,
    },
    success: {
      color: theme.colors.success,
      fontSize: theme.font.sm,
      fontWeight: '700',
      lineHeight: 19,
    },
    loadingButton: {
      minHeight: 52,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    loadingText: {
      color: theme.colors.background,
      fontSize: theme.font.md,
      fontWeight: '800',
    },
    loginHint: {
      color: theme.colors.muted,
      textAlign: 'center',
      fontSize: theme.font.sm,
      fontWeight: '700',
      marginTop: theme.spacing.sm,
    },
  });
}