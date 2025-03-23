import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
    }
  )
)

export const themeColors = {
  primary: {
    light: '#60A5FA',
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
  },
  secondary: {
    light: '#34D399',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  background: {
    light: '#F9FAFB',
    dark: '#111827',
  },
  text: {
    light: '#111827',
    dark: '#F9FAFB',
  },
  border: {
    light: '#E5E7EB',
    dark: '#374151',
  },
  error: {
    light: '#F87171',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },
  success: {
    light: '#34D399',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FBBF24',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
  },
  info: {
    light: '#60A5FA',
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
  },
};

export const chartColors = {
  price: '#3B82F6',
  ma20: '#10B981',
  ma50: '#F59E0B',
  ma200: '#8B5CF6',
  volume: '#6B7280',
  returns: '#EF4444',
};

export const getThemeColor = (color: keyof typeof themeColors, isDark: boolean = false) => {
  const colorObj = themeColors[color];
  if (typeof colorObj === 'string') return colorObj;
  return isDark ? colorObj.dark : colorObj.light;
};

export const getChartColor = (metric: keyof typeof chartColors) => {
  return chartColors[metric];
}; 