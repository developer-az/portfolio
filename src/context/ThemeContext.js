'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Start with a default theme but don't render it yet
  const [theme, setTheme] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // After component mounts, check for saved preference
  useEffect(() => {
    // First check stored preference
    const savedTheme = localStorage.getItem('theme');
    
    // Set theme based on saved preference or system preference
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      // Save the default to localStorage
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    
    // Mark as mounted to avoid hydration issues
    setMounted(true);
  }, []);
  
  // Apply theme class to document element when theme changes, but only after mounted
  useEffect(() => {
    if (!mounted || theme === '') return;
    
    // Remove all theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Also set data-theme attribute for components that might use it
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, mounted]);
  
  // Toggle theme function
  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Set a specific theme
  const setThemeMode = (mode) => {
    if (!mounted) return;
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode);
    }
  };
  
  // Return a consistent theme context to avoid rendering issues
  const value = {
    theme: mounted ? theme : 'dark', // Default to dark until mounted
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

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};