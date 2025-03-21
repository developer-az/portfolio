'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function Providers({ children }) {
  // This effect applies a class to the body to prevent FOUC 
  // (Flash of Unstyled Content) during initial load
  useEffect(() => {
    // Try to get stored theme to apply early
    let initialTheme;
    
    try {
      initialTheme = localStorage.getItem('theme');
    } catch (error) {
      // If localStorage is not available, default to dark
      initialTheme = 'dark';
    }
    
    // Default to dark theme if no preference found
    const themeToApply = initialTheme || 'dark';
    
    // Apply theme class immediately to avoid flash
    document.documentElement.classList.add(`${themeToApply}-theme`);
    
    // Short timeout before removing loader class to ensure smooth transition
    const timer = setTimeout(() => {
      document.body.classList.remove('loading');
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}