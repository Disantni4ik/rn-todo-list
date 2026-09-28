import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  statusBarStyle: 'light' | 'dark';
}

export const lightColors: ThemeColors = {
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#6C757D',
  border: '#E9ECEF',
  primary: '#007AFF',
  success: '#28A745',
  danger: '#DC3545',
  statusBarStyle: 'dark',
};

export const darkColors: ThemeColors = {
  bg: '#121212',
  surface: '#1E1E1E',
  text: '#F8F9FA',
  textMuted: '#A0A0A0',
  border: '#2C2C2C',
  primary: '#0A84FF',
  success: '#30D158',
  danger: '#FF453A',
  statusBarStyle: 'light',
};

interface ThemeContextType {
    isDarkMode: boolean,
    colors: ThemeColors,
    toggleTheme: () => Promise<void>
}

const THEME_STORAGE_KEY = '@todo_theme_mode'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: {children: ReactNode}) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)

                if (savedTheme !== null) {
                    setIsDarkMode(JSON.parse(savedTheme))
                }
            }
            catch (error) {
                console.error('Помилка завантаження теми з AsyncStorage: ', error)
            }
        }
        loadTheme()
    }, [])

    const toggleTheme = async () => {
        try {
            const nextMode = !isDarkMode
            setIsDarkMode(nextMode)
            await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextMode))
        }
        catch (error) {
            console.error('Помилка збереження теми в AsyncStorage: ', error)
        }
    }

    const currentColors = isDarkMode ? darkColors : lightColors

    return (
        <ThemeContext.Provider value={{isDarkMode, colors: currentColors, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme має використовуватися в середині ThemeProvider')
    }
    return context
}