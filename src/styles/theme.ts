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
    xl: 24,
    full: 9999,
  },
  font: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 28,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  colors: {
    background: '#050816',
    backgroundSecondary: '#0d1526',
    surface: '#0b1120',
    surfaceElevated: '#111c30',
    card: '#111827',
    primary: '#38bdf8',
    primarySoft: '#38bdf820',
    success: '#10b981',
    danger: '#ef4444',
    text: '#f8fafc',
    muted: '#94a3b8',
    border: '#1f2937',
    borderSoft: '#1a2540',
  },
  ...sharedTheme,
};

export const lightTheme = {
  colors: {
    background: '#f8fafc',
    backgroundSecondary: '#f1f5f9',
    surface: '#ffffff',
    surfaceElevated: '#f8fafc',
    card: '#ffffff',
    primary: '#0ea5e9',
    primarySoft: '#0ea5e920',
    success: '#059669',
    danger: '#dc2626',
    text: '#0f172a',
    muted: '#475569',
    border: '#dbe2ea',
    borderSoft: '#e8edf3',
  },
  ...sharedTheme,
};

export type AppTheme = typeof darkTheme;