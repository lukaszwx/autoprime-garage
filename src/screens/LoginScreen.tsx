import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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

import { RootStackParamList } from '../navigation/navigationTypes';
import { PremiumButton } from '../components/PremiumButton';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';
import { authService } from '../services/authService';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export function LoginScreen({
  navigation,
}: Props) {
  const { theme } = useTheme();

  const { width } =
    useWindowDimensions();

  const isCompact = width < 380;

  const styles = createStyles(
    theme,
    isCompact
  );

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState('');

  function validateForm() {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !password.trim()
    ) {
      return 'Preencha todos os campos.';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      return 'Informe um e-mail válido.';
    }

    return '';
  }

  async function handleLogin() {
    if (isSubmitting) return;

    setError('');

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const result =
        await authService.login(
          email.trim().toLowerCase(),
          password
        );

      if (result.error) {
        setError(result.error);
        return;
      }

      navigation.replace('Home');
    } catch {
      setError(
        'Não foi possível entrar agora.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <View style={styles.card}>
            <View style={styles.brandBadge}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.eyebrow}>
                AutoPrime Garage
              </Text>

              <Text style={styles.logo}>
                AUTOPRIME
              </Text>

              <Text style={styles.tagline}>
                Garage
              </Text>

              <Text
                style={styles.subtitle}
              >
                Acesse seu painel para
                gerenciar veículos,
                reservas e catálogo.
              </Text>
            </View>

            <View style={styles.form}>
              <View
                style={styles.inputGroup}
              >
                <Text style={styles.label}>
                  E-mail
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor={
                    theme.colors.muted
                  }
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View
                style={styles.inputGroup}
              >
                <Text style={styles.label}>
                  Senha
                </Text>

                <View
                  style={
                    styles.passwordRow
                  }
                >
                  <TextInput
                    style={
                      styles.passwordInput
                    }
                    placeholder="Digite sua senha"
                    placeholderTextColor={
                      theme.colors.muted
                    }
                    value={password}
                    onChangeText={
                      setPassword
                    }
                    secureTextEntry={
                      !showPassword
                    }
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={
                      handleLogin
                    }
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                      setShowPassword(
                        (
                          current
                        ) => !current
                      )
                    }
                  >
                    <Text
                      style={
                        styles.togglePassword
                      }
                    >
                      {showPassword
                        ? 'Ocultar'
                        : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <Text style={styles.error}>
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={
                  isSubmitting
                }
                onPress={
                  handleLogin
                }
              >
                {isSubmitting ? (
                  <View
                    style={
                      styles.loadingButton
                    }
                  >
                    <ActivityIndicator
                      color={
                        theme.colors
                          .background
                      }
                    />

                    <Text
                      style={
                        styles.loadingText
                      }
                    >
                      Entrando...
                    </Text>
                  </View>
                ) : (
                  <PremiumButton
                    label="Entrar"
                    onPress={
                      handleLogin
                    }
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                style={
                  styles.registerBtn
                }
                onPress={() =>
                  navigation.navigate(
                    'Register'
                  )
                }
              >
                <Text
                  style={
                    styles.registerText
                  }
                >
                  Ainda não tem conta?
                  Criar agora
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerText}>
            Sistema premium para
            gerenciamento de veículos
            de luxo.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(
  theme: AppTheme,
  isCompact: boolean
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: isCompact
        ? theme.spacing.md
        : theme.spacing.xl,
      minHeight: '100%',
    },

    card: {
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor:
        theme.colors.borderSoft,
      borderRadius:
        theme.radius.xl,
      padding: isCompact
        ? theme.spacing.md
        : theme.spacing.lg,

      ...theme.shadow.lg,
    },

    brandBadge: {
      width: 78,
      height: 78,
      borderRadius:
        theme.radius.full,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        theme.colors.surfaceElevated,

      borderWidth: 1,
      borderColor:
        theme.colors.primarySoft,

      marginBottom:
        theme.spacing.lg,

      alignSelf: 'center',

      ...theme.shadow.md,
    },

    brandLogo: {
      width: 56,
      height: 56,
    },

    header: {
      marginBottom:
        theme.spacing.xl,
      alignItems: 'center',
    },

    eyebrow: {
      color:
        theme.colors.primary,
      fontSize: theme.font.sm,
      fontWeight: '900',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom:
        theme.spacing.sm,
    },

    logo: {
      fontSize: isCompact
        ? 34
        : 42,

      fontWeight: '900',

      color:
        theme.colors.text,

      letterSpacing: isCompact
        ? 2
        : 4,
    },

    tagline: {
      fontSize:
        theme.font.xl,

      fontWeight: '300',

      color:
        theme.colors.primary,

      letterSpacing: 3,

      marginTop: -4,
    },

    subtitle: {
      fontSize:
        theme.font.sm,

      color:
        theme.colors.muted,

      marginTop:
        theme.spacing.md,

      lineHeight: 22,

      textAlign: 'center',

      maxWidth: 320,
    },

    form: {
      gap: theme.spacing.md,
    },

    inputGroup: {
      gap: 8,
    },

    label: {
      color:
        theme.colors.text,

      fontSize:
        theme.font.sm,

      fontWeight: '700',
    },

    input: {
      backgroundColor:
        theme.colors.backgroundSecondary,

      borderWidth: 1,

      borderColor:
        theme.colors.border,

      borderRadius:
        theme.radius.lg,

      padding:
        theme.spacing.md,

      color:
        theme.colors.text,

      fontSize:
        theme.font.md,
    },

    passwordRow: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        theme.colors.backgroundSecondary,

      borderWidth: 1,

      borderColor:
        theme.colors.border,

      borderRadius:
        theme.radius.lg,

      paddingHorizontal:
        theme.spacing.md,
    },

    passwordInput: {
      flex: 1,

      color:
        theme.colors.text,

      fontSize:
        theme.font.md,

      paddingVertical:
        theme.spacing.md,

      paddingRight:
        theme.spacing.sm,
    },

    togglePassword: {
      color:
        theme.colors.primary,

      fontSize:
        theme.font.sm,

      fontWeight: '900',
    },

    error: {
      color:
        theme.colors.danger,

      fontSize:
        theme.font.sm,

      fontWeight: '700',

      lineHeight: 19,
    },

    loadingButton: {
      minHeight: 54,

      borderRadius:
        theme.radius.lg,

      backgroundColor:
        theme.colors.primary,

      alignItems: 'center',

      justifyContent: 'center',

      flexDirection: 'row',

      gap: theme.spacing.sm,
    },

    loadingText: {
      color:
        theme.colors.background,

      fontSize:
        theme.font.md,

      fontWeight: '900',
    },

    registerBtn: {
      alignItems: 'center',

      paddingVertical:
        theme.spacing.sm,
    },

    registerText: {
      color:
        theme.colors.primary,

      fontSize:
        theme.font.md,

      fontWeight: '700',

      textAlign: 'center',
    },

    footerText: {
      marginTop:
        theme.spacing.lg,

      color:
        theme.colors.muted,

      fontSize:
        theme.font.sm,

      textAlign: 'center',

      lineHeight: 20,
    },
  });
}