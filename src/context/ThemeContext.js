'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Always use dark theme, no more light theme option
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('dark-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
    setMounted(true);
  }, []);

  // These functions now do nothing since we're always using dark theme
  const toggleTheme = () => {
    // No-op function - removed theme toggling
    return;
  };

  const setThemeMode = () => {
    // No-op function - removed theme setting
    return;
  };

  const value = {
    theme: 'dark', // Always dark
    toggleTheme,
    setThemeMode,
    mounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};