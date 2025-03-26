'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './InstagramAnalyzerNav.module.scss';
import { useRouter } from 'next/navigation';

const InstagramAnalyzerNav = () => {
  const router = useRouter();

  return (
    <motion.nav 
      className={styles.nav}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.3 }}
    >
      <div className={styles.navContainer}>
        <Link 
          href="/" 
          className={styles.logo} 
          onClick={(e) => {
            e.preventDefault();
            router.push('/');
          }}
        >
          <span className={styles.logoSymbol}>©</span>
          <span className={styles.logoText}>anthony-zhou.com</span>
        </Link>
      </div>
    </motion.nav>
  );
};

export default InstagramAnalyzerNav; 