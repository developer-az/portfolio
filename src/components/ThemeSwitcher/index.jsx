'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeSwitcher.module.scss';

const ThemeSwitcher = () => {
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Don't render during SSR to avoid hydration mismatch
  if (!mounted) return null;
  
  return (
    <motion.button
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className={styles.switchTrack}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            className={styles.iconWrapper}
            initial={{ opacity: 0, rotate: -90, x: '50%' }}
            animate={{ opacity: 1, rotate: 0, x: '0%' }}
            exit={{ opacity: 0, rotate: 90, x: '-50%' }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"></path>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            className={styles.iconWrapper}
            initial={{ opacity: 0, rotate: 90, x: '-50%' }}
            animate={{ opacity: 1, rotate: 0, x: '0%' }}
            exit={{ opacity: 0, rotate: -90, x: '50%' }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

export default ThemeSwitcher;