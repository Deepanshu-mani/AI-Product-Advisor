// contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Light theme - Clean whites and grays
const lightTheme = {
  colors: {
    background: "#fafafa",
    surface: "#ffffff",
    text: "#1a1a1a",
    textSecondary: "#6b7280",
    primary: "#000000",
    primaryForeground: "#ffffff",
    secondary: "#f3f4f6",
    secondaryForeground: "#374151",
    muted: "#f9fafb",
    mutedForeground: "#9ca3af",
    accent: "#f1f5f9",
    accentForeground: "#475569",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#e5e7eb",
    input: "#ffffff",
    ring: "#1f2937",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
    shadow: "#000000",
    // Additional gray shades for depth
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    gray900: "#111827",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    full: 9999,
  },
};

// Dark theme - Rich blacks and dark grays
const darkTheme = {
  colors: {
    background: "#000000",
    surface: "#0a0a0a",
    text: "#ffffff",
    textSecondary: "#d1d5db",
    primary: "#ffffff",
    primaryForeground: "#000000",
    secondary: "#111111",
    secondaryForeground: "#e5e7eb",
    muted: "#1a1a1a",
    mutedForeground: "#9ca3af",
    accent: "#1f1f1f",
    accentForeground: "#e5e7eb",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#1a1a1a",
    input: "#111111",
    ring: "#ffffff",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
    boxshadow: "#000000",
    // Additional dark gray shades for depth
    gray50: "#000000",
    gray100: "#0a0a0a",
    gray200: "#111111",
    gray300: "#1a1a1a",
    gray400: "#1f1f1f",
    gray500: "#262626",
    gray600: "#404040",
    gray700: "#525252",
    gray800: "#737373",
    gray900: "#a3a3a3",
  },
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  useEffect(() => {
    setCurrentTheme(isDarkTheme ? darkTheme : lightTheme);
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const setTheme = (isDark) => {
    setIsDarkTheme(isDark);
  };

  const value = {
    isDarkTheme,
    currentTheme,
    toggleTheme,
    setTheme,
    lightTheme,
    darkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
