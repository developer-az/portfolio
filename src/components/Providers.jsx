'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function Providers({ children }) {
  // This effect applies a class to the body to prevent FOUC 
  // (Flash of Unstyled Content) during initial load
  useEffect(() => {
    // Get stored theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
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