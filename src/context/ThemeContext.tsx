import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface ThemeColors {
  // Основні поверхні
  bg: string;
  surface: string;
  card: string;
  inputBg: string;

  // Текст
  text: string;
  textSecondary: string;
  textMuted: string;

  // Межі та розділювачі
  border: string;

  // Семантичні кольори
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  dangerLight: string;

  // Системні
  statusBarStyle: 'light' | 'dark';
}

export const lightColors: ThemeColors = {
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  inputBg: '#F1F3F5',

  text: '#1A1A1A',
  textSecondary: '#495057',
  textMuted: '#6C757D',

  border: '#E9ECEF',

  primary: '#007AFF',
  primaryLight: '#E8F2FF',
  secondary: '#6C757D',
  success: '#28A745',
  warning: '#F59E0B',
  danger: '#DC3545',
  dangerLight: '#FEE2E2',

  statusBarStyle: 'dark',
};

export const darkColors: ThemeColors = {
  bg: '#121212',
  surface: '#1E1E1E',
  card: '#1E1E1E',
  inputBg: '#2A2A2A',

  text: '#F8F9FA',
  textSecondary: '#CED4DA',
  textMuted: '#A0A0A0',

  border: '#2C2C2C',

  primary: '#0A84FF',
  primaryLight: '#0A3B75',
  secondary: '#8E8E93',
  success: '#30D158',
  warning: '#FBBF24',
  danger: '#FF453A',
  dangerLight: '#4A1517',

  statusBarStyle: 'light',
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = '@todo_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('Помилка завантаження теми з AsyncStorage: ', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextMode));
    } catch (error) {
      console.error('Помилка збереження теми в AsyncStorage: ', error);
    }
  };

  const currentColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors: currentColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme має використовуватися в середині ThemeProvider');
  }
  return context;
};