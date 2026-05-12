import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  loadingLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  loadingLabel,
  style,
  textStyle,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[size],
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
    >
      {loading ? (
        <>
          <ActivityIndicator
            color={
              variant === 'primary'
                ? theme.colors.background
                : theme.colors.text
            }
            size="small"
          />

          {loadingLabel ? (
            <Text
              style={[
                styles.label,
                styles[`${variant}Label`],
                textStyle,
              ]}
            >
              {loadingLabel}
            </Text>
          ) : null}
        </>
      ) : (
        <Text
          style={[
            styles.label,
            styles[`${variant}Label`],
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    base: {
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      borderWidth: 1,
    },

    sm: {
      minHeight: 40,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 10,
    },

    md: {
      minHeight: 50,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 14,
    },

    lg: {
      minHeight: 58,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: 16,
    },

    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    secondary: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },

    danger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
    },

    ghost: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    },

    disabled: {
      opacity: 0.55,
    },

    label: {
      fontSize: theme.font.md,
      fontWeight: '900',
      letterSpacing: 0.4,
    },

    primaryLabel: {
      color: theme.colors.background,
    },

    secondaryLabel: {
      color: theme.colors.text,
    },

    dangerLabel: {
      color: '#ffffff',
    },

    ghostLabel: {
      color: theme.colors.muted,
    },
  });
}