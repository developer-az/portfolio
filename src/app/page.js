"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import Preloader from "../components/Preloader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Import components
import EnhancedBackground from '../components/EnhancedBackground';
import ProfileSection from '../components/ProfileSection';
import ResumeSection from '../components/ResumeSection';
import WorkSection from '../components/WorkSection'; // Add this import
import ContactSection from '../components/ContactSection';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Set a default theme instead of trying to use the context
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Detect theme from HTML class on initial load
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark-theme');
    const isLightTheme = document.documentElement.classList.contains('light-theme');
    
    if (isLightTheme) {
      setCurrentTheme('light');
    } else if (isDarkTheme) {
      setCurrentTheme('dark');
    }
    
    // Set up an observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark-theme');
          const isLight = document.documentElement.classList.contains('light-theme');
          
          if (isLight) {
            setCurrentTheme('light');
          } else if (isDark) {
            setCurrentTheme('dark');
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Refs for GSAP animations
  const header = useRef(null);
  const portfolioContent = useRef(null);

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

    // Simpler loading sequence
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
      
      setTimeout(() => {
        setIsFadingOut(true);
        
        setTimeout(() => {
          setShowPortfolio(true);
          setIsFadingOut(false);
          document.body.style.overflow = "auto";
        }, 1000);
      }, 2000);
    }, 2000);

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [showPortfolio]);

  // Handle scroll to update active section
  useEffect(() => {
    if (showPortfolio) {
      const handleScroll = () => {
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
    }
  }, [showPortfolio]);

  // Update header animation to use currentTheme
  useEffect(() => {
    if (showPortfolio && portfolioContent.current) {
      // Header animation
      if (header.current) {
        gsap.to(header.current, {
          scrollTrigger: {
            trigger: portfolioContent.current,
            start: "top top",
            end: "100 top",
            scrub: 1,
          },
          backgroundColor: currentTheme === 'dark' ? "rgba(18, 18, 18, 0.95)" : "rgba(245, 245, 245, 0.95)",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
        });
      }
    }
  }, [showPortfolio, currentTheme]);

  // Mouse tracking for intro effect
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Navigation components
  const Navigation = ({ currentPath }) => {
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
        <a href="#resume" className={`${styles.navLink} ${activeSection === 'resume' ? styles.active : ''}`}>Resume</a>
        <a href="#work" className={`${styles.navLink} ${activeSection === 'work' ? styles.active : ''}`}>Work</a>
        <a href="#contact" className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}>Contact</a>
        <Link href="/instagram-analyzer" className={styles.navLink}>
          Instagram Analyzer
        </Link>
      </div>
    );
  };

  const MobileMenu = ({ currentPath, setMobileMenuOpen }) => {
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
  };

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
          <EnhancedBackground color={currentTheme === 'dark' ? "#121212" : "#f5f5f5"} />
          
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
              <Navigation currentPath="/" />

              {/* Mobile Menu Button */}
              <button
                className={styles.menuButton}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            <MobileMenu currentPath="/" setMobileMenuOpen={setMobileMenuOpen} />
          </header>

          {/* Portfolio Content */}
          <div ref={portfolioContent} className={styles.portfolioContent}>
            {/* About Section with Profile */}
            <section id="about" className={styles.about}>
              <ProfileSection />
            </section>
            
            {/* Resume Section */}
            <ResumeSection />
            
            {/* Work Section - Now using the dedicated component */}
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