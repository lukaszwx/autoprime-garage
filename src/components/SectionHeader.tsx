import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.font.xl,
      fontWeight: '700',
      color: theme.colors.text,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: 2,
    },
  });
}
