import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
  style?: ViewStyle;
}

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  style,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text} size="small" />
      ) : (
        <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    base: {
      paddingVertical: 14,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    danger: {
      backgroundColor: theme.colors.danger,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      color: theme.colors.background,
      fontSize: theme.font.md,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    ghostLabel: {
      color: theme.colors.muted,
    },
  });
}
