import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.scss';

const Header = ({ activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Toggle body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants = {
    closed: {
      y: 20,
      opacity: 0
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Burger button animation variants
  const burgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };

  const burgerLineVariants = {
    closed: {
      top: undefined,
      bottom: undefined,
      rotate: 0
    },
    open: index => ({
      top: index === 0 ? "50%" : undefined,
      bottom: index === 2 ? "50%" : undefined,
      rotate: index === 1 ? 0 : index === 0 ? 45 : -45,
      opacity: index === 1 ? 0 : 1,
      transition: { duration: 0.4 }
    })
  };

  // Links for navigation
  const navLinks = [
    { href: "/#home", label: "Home", section: "home" },
    { href: "/#about", label: "About", section: "about" },
    { href: "/#resume", label: "Resume", section: "resume" },
    { href: "/#work", label: "Work", section: "work" },
    { href: "/#contact", label: "Contact", section: "contact" },
    { href: "/instagram-analyzer", label: "Instagram Analyzer", section: "instagram-analyzer" }
  ];

  const isActive = (section) => activeSection === section;

  return (
    <header 
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoSymbol}>AZ</span>
          <span className={styles.logoText}>
            <span className={styles.firstName}>Anthony</span>
            <span className={styles.lastName}>Zhou</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link 
              key={link.section} 
              href={link.href} 
              className={`${styles.navLink} ${isActive(link.section) ? styles.active : ''}`}
            >
              <span>{link.label}</span>
              {isActive(link.section) && (
                <motion.div 
                  className={styles.activeIndicator}
                  layoutId="navIndicator"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          variants={burgerVariants}
          animate={menuOpen ? "open" : "closed"}
          initial="closed"
        >
          {[0, 1, 2].map((i) => (
            <motion.span 
              key={i} 
              className={styles.burgerLine}
              custom={i}
              variants={burgerLineVariants}
              animate={menuOpen ? "open" : "closed"}
            />
          ))}
        </motion.button>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className={styles.mobileMenu}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className={styles.mobileMenuInner}>
                <motion.nav className={styles.mobileNav}>
                  {navLinks.map((link, index) => (
                    <motion.div 
                      key={link.section}
                      variants={menuItemVariants}
                    >
                      <Link 
                        href={link.href} 
                        className={`${styles.mobileNavLink} ${isActive(link.section) ? styles.active : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.navIndex}>{(index + 1).toString().padStart(2, '0')}</span>
                        <span className={styles.navLabel}>{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                <motion.div 
                  className={styles.menuFooter}
                  variants={menuItemVariants}
                >
                  <div className={styles.socialLinks}>
                    <a href="https://github.com/developer-az" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                    <a href="https://linkedin.com/in/anthony--zhou" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </div>
                  <p className={styles.copyright}>© {new Date().getFullYear()} Anthony Zhou</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;