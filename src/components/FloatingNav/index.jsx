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

// Menu slide animation variants
const menuSlide = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { x: "calc(100% + 100px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
};

// Link animation variants
const linkVariants = {
  initial: { x: 80 },
  enter: i => ({ x: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i } }),
  exit: i => ({ x: 80, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i } })
};

// Scale animation for indicators
const scale = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } }
};

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

// Social links for nav panel
const socialLinks = [
  { name: "GitHub", url: "https://github.com/developer-az", icon: "github" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/anthony--zhou", icon: "linkedin" },
  { name: "Instagram", url: "https://instagram.com/anthonyyzhou", icon: "instagram" }
];

// Social icon component
const SocialIcon = ({ icon }) => {
  switch(icon) {
    case 'github':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      );
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      );
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    default:
      return null;
  }
};

const FloatingNav = ({ activeSection = "" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(activeSection ? `#${activeSection}` : "#about");
  
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
  
  // Update selected indicator when active section changes
  useEffect(() => {
    if (activeSection) {
      setSelectedIndicator(`#${activeSection}`);
    }
  }, [activeSection]);
  
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

  // Handle navigation link click
  const handleLinkClick = (href) => {
    setSelectedIndicator(href);
    // Close the menu on mobile after link click with a slight delay
    setTimeout(() => setMobileMenuOpen(false), 300);
  };

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
                  onClick={() => handleLinkClick(item.href)}
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
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </motion.button>
      )}

      {/* Animated Side Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Slide-in menu panel */}
            <motion.div 
              className={styles.navPanel}
              variants={menuSlide}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <div className={styles.navPanelHeader}>
                <motion.div 
                  className={styles.headerLogo}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className={styles.headerLogoSymbol}>©</span>
                  <div className={styles.headerLogoText}>
                    <span className={styles.headerName}>ANTHONY ZHOU</span>
                    <span className={styles.headerDesc}>Developer & Designer</span>
                  </div>
                </motion.div>
                <motion.h2 
                  className={styles.navigationTitle}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Navigation
                </motion.h2>
              </div>
              
              <div className={styles.navPanelLinks} 
                onMouseLeave={() => setSelectedIndicator(`#${activeSection}`)}
              >
                {navItems.map((item, index) => (
                  <motion.div 
                    key={item.title}
                    custom={index}
                    variants={linkVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className={styles.navPanelLink}
                  >
                    <Link 
                      href={item.href}
                      className={`${styles.panelNavLink} ${selectedIndicator === item.href ? styles.active : ''}`}
                      onClick={() => handleLinkClick(item.href)}
                      onMouseEnter={() => setSelectedIndicator(item.href)}
                    >
                      <motion.div 
                        variants={scale}
                        animate={selectedIndicator === item.href ? "open" : "closed"}
                        className={styles.indicator}
                      />
                      <span className={styles.panelLinkIcon}>
                        <NavIcon icon={item.icon} />
                      </span>
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className={styles.navPanelFooter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className={styles.socialIcons}>
                  {socialLinks.map((link) => (
                    <a 
                      key={link.name} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialIcon}
                      aria-label={link.name}
                    >
                      <SocialIcon icon={link.icon} />
                    </a>
                  ))}
                </div>
                <div className={styles.footerText}>
                  © 2025 Anthony Zhou
                </div>
              </motion.div>
              
              {/* Curve decoration */}
              <div className={styles.navCurve}>
                <svg className={styles.curveSvg} width="100" height="100%" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                  <motion.path 
                    d="M100 0 L100 100 Q100 50 100 0"
                    initial={{ d: "M100 0 L100 100 Q-100 50 100 0" }}
                    animate={{ d: "M100 0 L100 100 Q100 50 100 0" }}
                    exit={{ d: "M100 0 L100 100 Q-100 50 100 0" }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(FloatingNav);