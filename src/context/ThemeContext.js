'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Start with undefined to avoid hydration mismatch
  const [theme, setTheme] = useState(undefined);
  const [mounted, setMounted] = useState(false);
  
  // After component mounts, check for saved preference and apply it
  useEffect(() => {
    // First set mounted to true so we know hydration is complete
    setMounted(true);
    
    // Get stored theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Apply theme class to document element when theme changes
  useEffect(() => {
    if (!mounted || theme === undefined) return;
    
    // Remove all theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Also set data-theme attribute for components that might use it
    document.documentElement.setAttribute('data-theme', theme);
    
    // For debugging
    console.log('Theme set to:', theme);
  }, [theme, mounted]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Set a specific theme
  const setThemeMode = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode);
    }
  };
  
  // Provide minimal context until mounted to avoid hydration issues
  if (!mounted) {
    return <ThemeContext.Provider value={{ theme: 'dark', mounted: false }}>{children}</ThemeContext.Provider>;
  }
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme,
      setThemeMode,
      mounted
    }}>
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