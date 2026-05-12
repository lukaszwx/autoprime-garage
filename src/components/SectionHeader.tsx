import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  align = 'left',
  style,
}: Props) {
  const { theme } = useTheme();

  const styles = createStyles(theme, align);

  return (
    <View style={[styles.container, style]}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badge}
          </Text>
        </View>
      ) : null}

      <Text style={styles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(
  theme: AppTheme,
  align: 'left' | 'center'
) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
      alignItems:
        align === 'center'
          ? 'center'
          : 'flex-start',
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor:
        theme.colors.primary + '15',
      borderWidth: 1,
      borderColor:
        theme.colors.primary + '30',
      marginBottom: theme.spacing.sm,
    },

    badgeText: {
      color: theme.colors.primary,
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },

    title: {
      fontSize: theme.font.xxl,
      fontWeight: '900',
      color: theme.colors.text,
      letterSpacing: -1,
      textAlign:
        align === 'center'
          ? 'center'
          : 'left',
    },

    subtitle: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginTop: 6,
      lineHeight: 20,
      maxWidth: 540,
      textAlign:
        align === 'center'
          ? 'center'
          : 'left',
    },
  });
}