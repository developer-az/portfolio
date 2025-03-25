import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloatingNav.module.scss';
import Magnetic from '../../common/Magnetic';

// Navigation items configuration
const navItems = [
  { title: "About", href: "#about", icon: "user" },
  { title: "Skills", href: "#skills", icon: "code" },
  { title: "Resume", href: "#resume", icon: "file" },
  { title: "Projects", href: "#work", icon: "briefcase" },
  { title: "Contact", href: "#contact", icon: "contact" },
  { title: "IG Analyzer", href: "/instagram-analyzer", icon: "instagram" }
];

// Icons component with memoization for better performance
const NavIcon = React.memo(({ icon }) => {
  switch(icon) {
    case 'user':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      );
    case 'code':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      );
    case 'file':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    case 'briefcase':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      );
    case 'contact':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      );
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    default:
      return null;
  }
});

// Main navigation component
const FloatingNav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle scroll effects
  useEffect(() => {
    // Throttled scroll handler for better performance
    let lastScrollTime = 0;
    const scrollThreshold = 100;
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < 100) return; // Throttle to 10 updates per second
      lastScrollTime = now;
      
      setScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants for menu items
  const menuItemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.05 * i,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  }), []);

  return (
    <>
      {/* Desktop Navigation Bar */}
      <motion.nav 
        className={`${styles.floatingNav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.3 }}
      >
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoSymbol}>©</span>
            <span className={styles.logoText}>anthony-zhou.com</span>
          </Link>
          
          <div className={styles.navLinks}>
            {navItems.map((item, index) => (
              <Magnetic key={item.href}>
                <Link 
                  href={item.href}
                  className={`${styles.navLink} ${activeSection === item.href.replace('#', '') ? styles.active : ''}`}
                  data-section={item.href.replace('#', '')}
                >
                  <span className={styles.linkIcon}>
                    <NavIcon icon={item.icon} />
                  </span>
                  <span className={styles.linkText}>{item.title}</span>
                </Link>
              </Magnetic>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <motion.button
          className={`${styles.mobileNavToggle} ${mobileMenuOpen ? styles.active : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </motion.button>
      )}

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileNavMenu}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25 
            }}
          >
            <div className={styles.mobileNavContainer}>
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${activeSection === item.href.replace('#', '') ? styles.active : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.mobileNavIcon}>
                    <NavIcon icon={item.icon} />
                  </div>
                  {item.title}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(FloatingNav);