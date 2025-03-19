'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function Providers({ children }) {
  // This effect applies a class to the body to prevent FOUC 
  // (Flash of Unstyled Content) during initial load
  useEffect(() => {
    // Get stored theme or default to dark
    const savedTheme = localStorage.getItem('theme');
    // Default to dark theme
    const initialTheme = savedTheme || 'dark';
    document.documentElement.classList.add(`${initialTheme}-theme`);
    
    // Remove loader class
    document.body.classList.remove('loading');
    
    return () => {
      document.documentElement.classList.remove('dark-theme', 'light-theme');
    };
  }, []);
  
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}