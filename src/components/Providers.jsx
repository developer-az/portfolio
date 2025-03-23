'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function Providers({ children }) {
  // This effect applies a class to the body to prevent FOUC 
  // (Flash of Unstyled Content) during initial load
  useEffect(() => {
    // Always use dark theme
    document.documentElement.classList.add('dark-theme');
    
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