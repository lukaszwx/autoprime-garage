export type ThemeMode = 'dark' | 'light';

const sharedTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  font: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 28,
  },
};

export const darkTheme = {
  colors: {
    background: '#050816',
    surface: '#0b1120',
    card: '#111827',
    primary: '#38bdf8',
    success: '#10b981',
    danger: '#ef4444',
    text: '#f8fafc',
    muted: '#94a3b8',
    border: '#1f2937',
  },
  ...sharedTheme,
};

export const lightTheme = {
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    card: '#ffffff',
    primary: '#0ea5e9',
    success: '#059669',
    danger: '#dc2626',
    text: '#0f172a',
    muted: '#475569',
    border: '#dbe2ea',
  },
  ...sharedTheme,
};

export type AppTheme = typeof darkTheme;
