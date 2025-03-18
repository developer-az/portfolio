'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Ensure stable initial state before hydration
  const [theme, setTheme] = useState('dark'); // Default to dark theme
  const [mounted, setMounted] = useState(false);
  
  // After component mounts, check for saved preference and apply it
  useEffect(() => {
    setMounted(true);
    
    // First try to get from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);
  
  // Apply theme class to document element when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    // Remove all theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Save preference
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Only provide theme context after component has mounted
  // to avoid hydration mismatch
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme,
      mounted  // Include mounted state so consumers can check
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