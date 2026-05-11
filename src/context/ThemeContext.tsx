import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppTheme,
  ThemeMode,
  darkTheme,
  lightTheme,
} from '../styles/theme';

const THEME_STORAGE_KEY = '@autoprime/theme-mode';

interface ThemeContextValue {
  isDark: boolean;
  mode: ThemeMode;
  theme: AppTheme;
  navigationTheme: NavigationTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: (value?: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function buildNavigationTheme(theme: AppTheme, isDark: boolean): NavigationTheme {
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    async function loadThemePreference() {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedMode === 'dark' || storedMode === 'light') {
          setModeState(storedMode);
        }
      } catch {
        // para manter o tema padrã caso o tema não seja carregado corretamente
      }
    }

    loadThemePreference();
  }, []);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => {
      // Ignora erros de persistência, pois o tema ainda funcionará mesmo que a preferência não seja salva
    });
  };

  const toggleTheme = (value?: boolean) => {
    if (typeof value === 'boolean') {
      setMode(value ? 'dark' : 'light');
      return;
    }

    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return {
      isDark,
      mode,
      theme,
      navigationTheme: buildNavigationTheme(theme, isDark),
      setMode,
      toggleTheme,
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
