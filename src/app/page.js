"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import Preloader from "../components/Preloader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useTheme } from '@/context/ThemeContext';

// Import components with React.lazy for code-splitting
import dynamic from 'next/dynamic';

// Import only the EnhancedBackground component directly
import EnhancedBackground from '../components/EnhancedBackground';

// Dynamically import other heavy components for better performance
const ProfileSection = dynamic(() => import('../components/ProfileSection'), { ssr: true });
const ResumeSection = dynamic(() => import('../components/ResumeSection'), { ssr: true });
const WorkSection = dynamic(() => import('../components/WorkSection'), { ssr: true });
const ContactSection = dynamic(() => import('../components/ContactSection'), { ssr: true });
const SkillsSection = dynamic(() => import('../components/SkillsSection'), { ssr: true });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Use the theme context properly
  const { theme, mounted } = useTheme();

  // Refs for GSAP animations
  const header = useRef(null);
  const portfolioContent = useRef(null);
  
  // Use memo for menu toggle to avoid unnecessary re-renders
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Setup scroll triggers as a separate function
  const registerScrollTriggers = useCallback(() => {
    if (!header.current || !portfolioContent.current) return;
    
    // Header animation
    gsap.to(header.current, {
      scrollTrigger: {
        trigger: portfolioContent.current,
        start: "top top",
        end: "100 top",
        scrub: 1,
      },
      backgroundColor: theme === 'dark' ? "rgba(18, 18, 18, 0.95)" : "rgba(245, 245, 245, 0.95)",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
    });
    
    // Update active section on scroll
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id)
      });
    });
  }, [theme]);

  useEffect(() => {
    // Initialize GSAP plugins
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Fix for initial scroll position
    window.scrollTo(0, 0);
    
    // Hide overflow during intro
    if (!showPortfolio) {
      document.body.style.overflow = 'hidden';
    }

    // Optimize loading sequence with reduced timeouts for better responsiveness
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
      
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        
        const showTimer = setTimeout(() => {
          setShowPortfolio(true);
          setIsFadingOut(false);
          document.body.style.overflow = "auto";
          
          // Register scroll trigger for sections once portfolio is shown
          registerScrollTriggers();
        }, 800); // Reduced from 1000
        
        return () => clearTimeout(showTimer);
      }, 1500); // Reduced from 2000
      
      return () => clearTimeout(fadeTimer);
    }, 1500); // Reduced from 2000

    // Cleanup function
    return () => {
      clearTimeout(loadTimer);
      
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [registerScrollTriggers, showPortfolio]);

  // Handle scroll to update active section - with throttling for performance
  useEffect(() => {
    if (!showPortfolio) return;
    
    let lastScrollTime = 0;
    const throttleTime = 100; // ms
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleTime) return;
      lastScrollTime = now;
      
      const scrollPosition = window.scrollY;
      
      // Find which section is currently in view based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPortfolio]);

  // Mouse tracking for intro effect - with memoization for performance
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Navigation components - memoized to prevent unnecessary re-renders
  const NavigationComponent = useMemo(() => {
    // Named function for ESLint display-name rule
    function Navigation({ currentPath }) {
      // Only show the Home link when not on the main page
      const isMainPage = currentPath === '/' || !currentPath;
      
      return (
        <div className={styles.nav}>
          {!isMainPage && (
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          )}
          <a href="#about" className={`${styles.navLink} ${activeSection === 'about' ? styles.active : ''}`}>About</a>
          <a href="#skills" className={`${styles.navLink} ${activeSection === 'skills' ? styles.active : ''}`}>Skills</a>
          <a href="#resume" className={`${styles.navLink} ${activeSection === 'resume' ? styles.active : ''}`}>Resume</a>
          <a href="#work" className={`${styles.navLink} ${activeSection === 'work' ? styles.active : ''}`}>Work</a>
          <a href="#contact" className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}>Contact</a>
          <Link href="/instagram-analyzer" className={styles.navLink}>
            Instagram Analyzer
          </Link>
        </div>
      );
    }
    
    Navigation.displayName = 'Navigation';
    return Navigation;
  }, [activeSection]);

  const MobileMenuComponent = useMemo(() => {
    // Named function for ESLint display-name rule
    function MobileMenu({ currentPath, setMobileMenuOpen }) {
      const isMainPage = currentPath === '/' || !currentPath;
      
      return (
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}>
          <div className={styles.mobileMenuContent}>
            {!isMainPage && (
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={styles.navLink}
              >
                Home
              </Link>
            )}
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className={styles.navLink}
            >
              About
            </a>
            <a 
              href="#skills" 
              onClick={() => setMobileMenuOpen(false)}
              className={styles.navLink}
            >
              Skills
            </a>
            <a 
              href="#resume" 
              onClick={() => setMobileMenuOpen(false)}
              className={styles.navLink}
            >
              Resume
            </a>
            <a 
              href="#work" 
              onClick={() => setMobileMenuOpen(false)}
              className={styles.navLink}
            >
              Work
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={styles.navLink}
            >
              Contact
            </a>
            <Link 
              href="/instagram-analyzer" 
              onClick={() => setMobileMenuOpen(false)}
              className={styles.navLink}
            >
              Instagram Analyzer
            </Link>
          </div>
        </div>
      );
    }
    
    MobileMenu.displayName = 'MobileMenu';
    return MobileMenu;
  }, [mobileMenuOpen]);

  // Only render content if theme is loaded to avoid flashing
  if (!mounted) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className={styles.mainWrapper}>
      {/* Preloader Animation */}
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      {/* Initial Intro Effect */}
      {!showPortfolio && !isLoading && (
        <main className={`${styles.main} ${isFadingOut ? styles.fadeOut : ''}`}>
          <motion.div
            className={styles.mask}
            animate={{
              WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
              WebkitMaskSize: `${size}px`,
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
          >
            <p
              onMouseEnter={() => {
                setIsHovered(true);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
              }}
            >
              你好我是周嘉成<span>.</span>
            </p>
          </motion.div>

          <div className={styles.body}>
            <p>
              Hello, I am <span>Anthony Zhou</span>.
            </p>
          </div>
        </main>
      )}

      {/* Portfolio Content */}
      {showPortfolio && (
        <div className={styles.portfolioWrapper}>
          {/* Enhanced 3D Background */}
          <EnhancedBackground color={theme === 'dark' ? "#121212" : "#f5f5f5"} />
          
          {/* Header */}
          <header ref={header} className={styles.header} id="home">
            <div className={styles.headerContent}>
              <div className={styles.logo}>
                <p className={styles.copyright}>©</p>
                <div className={styles.logoText}>
                  <p className={styles.codeBy}>Code by</p>
                  <h1 className={styles.name}>
                    <span className={styles.firstName}>Anthony</span>
                    <span className={styles.lastName}>Zhou</span>
                  </h1>
                </div>
              </div>

              {/* Desktop Navigation */}
              <NavigationComponent currentPath="/" />

              {/* Mobile Menu Button */}
              <button
                className={styles.menuButton}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <div
                  className={`${styles.menuButtonLine} ${
                    mobileMenuOpen ? styles.active : ""
                  }`}
                ></div>
                <div
                  className={`${styles.menuButtonLine} ${
                    mobileMenuOpen ? styles.active : ""
                  }`}
                ></div>
                <div
                  className={`${styles.menuButtonLine} ${
                    mobileMenuOpen ? styles.active : ""
                  }`}
                ></div>
              </button>
            </div>

            {/* Mobile Menu */}
            <MobileMenuComponent currentPath="/" setMobileMenuOpen={setMobileMenuOpen} />
          </header>

          {/* Portfolio Content */}
          <div ref={portfolioContent} className={styles.portfolioContent}>
            {/* About Section with Profile */}
            <section id="about" className={styles.about}>
              <ProfileSection />
            </section>
            
            {/* Skills Section */}
            <section id="skills">
              <SkillsSection />
            </section>
            
            {/* Resume Section */}
            <ResumeSection />
            
            {/* Work Section */}
            <WorkSection />
            
            {/* Contact Section */}
            <ContactSection />
            
            {/* Footer */}
            <footer className={styles.footer}>
              <div className={styles.footerContent}>
                <div className={styles.copyright}>
                  <p>© 2025 Anthony Zhou - All Rights Reserved</p>
                </div>
                
                <div className={styles.techStack}>
                  <p>Built with Next.js, Framer Motion, Three.js, and GSAP</p>
                </div>
                
                <div className={styles.scrollToTop}>
                  <motion.button 
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}
                    aria-label="Scroll to top"
                    className={styles.scrollTopButton}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}