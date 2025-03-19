import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.scss';
import RoundedButton from '../../common/RoundedButton';
import Magnetic from '../../common/Magnetic';

const Header = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 100) {
          headerRef.current.classList.add(styles.scrolled);
        } else {
          headerRef.current.classList.remove(styles.scrolled);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for navigation highlighting
  const isActive = (sectionId) => {
    return activeSection === sectionId;
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <p className={styles.copyright}>©</p>
          <div className={styles.logoText}>
            <p className={styles.codeBy}>Code by</p>
            <h1 className={styles.name}>
              <span className={styles.firstName}>Anthony</span>
              <span className={styles.lastName}>Zhou</span>
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.nav}>
          <Magnetic>
            <Link href="/#home" className={`${styles.navLink} ${isActive("home") ? styles.active : ""}`}>
              Home
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/#about" className={`${styles.navLink} ${isActive("about") ? styles.active : ""}`}>
              About
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/#work" className={`${styles.navLink} ${isActive("work") ? styles.active : ""}`}>
              Work
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/#contact" className={`${styles.navLink} ${isActive("contact") ? styles.active : ""}`}>
              Contact
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/instagram-analyzer" className={styles.navLink}>
              Instagram Analyzer
            </Link>
          </Magnetic>
        </div>

        {/* Mobile Menu Button */}
        <div className={styles.headerButtonContainer}>
          <RoundedButton 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className={styles.menuButton}
          >
            <div className={`${styles.burger} ${mobileMenuOpen ? styles.burgerActive : ""}`}></div>
          </RoundedButton>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={styles.mobileMenuContent}>
              <Link href="/#home" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
                Home
              </Link>
              <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
                About
              </Link>
              <Link href="/#work" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
                Work
              </Link>
              <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
                Contact
              </Link>
              <Link href="/instagram-analyzer" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
                Instagram Analyzer
              </Link>
            </div>

            {/* Close button */}
            <button 
              className={styles.closeButton}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;