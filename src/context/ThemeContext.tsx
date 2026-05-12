import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import React, {
  createContext,
  useCallback,
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
  isReady: boolean;
  mode: ThemeMode;
  theme: AppTheme;
  navigationTheme: NavigationTheme;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: (value?: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

function buildNavigationTheme(
  theme: AppTheme,
  isDark: boolean
): NavigationTheme {
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

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadThemePreference() {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (isMounted && isValidThemeMode(storedMode)) {
          setModeState(storedMode);
        }
      } catch (error) {
        console.log('THEME LOAD ERROR:', error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    loadThemePreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const setMode = useCallback(async (nextMode: ThemeMode) => {
    if (!isValidThemeMode(nextMode)) return;

    setModeState(nextMode);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch (error) {
      console.log('THEME SAVE ERROR:', error);
    }
  }, []);

  const toggleTheme = useCallback(
    async (value?: boolean) => {
      const nextMode =
        typeof value === 'boolean'
          ? value
            ? 'dark'
            : 'light'
          : mode === 'dark'
            ? 'light'
            : 'dark';

      await setMode(nextMode);
    },
    [mode, setMode]
  );

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return {
      isDark,
      isReady,
      mode,
      theme,
      navigationTheme: buildNavigationTheme(theme, isDark),
      setMode,
      toggleTheme,
    };
  }, [mode, isReady, setMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme deve ser usado dentro de ThemeProvider.'
    );
  }

  return context;
}