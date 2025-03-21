"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Import enhanced components
import EnhancedBackground from '../components/EnhancedBackground';
import ProfileSection from '../components/ProfileSection';
//import EnhancedResumeSection from '../components/EnhancedResumeSection';
import WorkSection from '../components/WorkSection';
import ContactSection from '../components/ContactSection';
import Header from '../components/Header';

// Import creative elements
import { 
  RevealText, 
  CustomCursor, 
  ScrollProgress, 
  FloatingElement 
} from '../components/CreativeDetails';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
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
        setShowPortfolio(true);
        document.body.style.overflow = "auto";
      }, 3000);
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

  // Mouse tracking for intro effect
  const { x, y } = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  const size = isHovered ? 400 : 40;

  // Intro animation variants
  const introVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.8
      }
    }
  };

  return (
    <div className={styles.mainWrapper}>
      {/* Custom cursor for desktop devices */}
      <CustomCursor />
      
      {/* Scroll progress indicator */}
      <ScrollProgress />
      
      {/* Initial Intro Effect - Margiela-inspired */}
      <AnimatePresence mode="wait">
        {!showPortfolio && !isLoading && (
          <motion.div 
            className={styles.introContainer}
            variants={introVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className={styles.introInner}>
              <motion.div
                className={styles.mask}
                animate={{
                  WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
                  WebkitMaskSize: `${size}px`,
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
              >
                <RevealText delay={0.5}>
                  <p
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    你好我是周嘉成<span>.</span>
                  </p>
                </RevealText>
              </motion.div>

              <div className={styles.body}>
                <RevealText delay={1.0}>
                  <p>
                    Hello, I am <span>Anthony Zhou</span>.
                  </p>
                </RevealText>
              </div>
              
              <motion.div 
                className={styles.introSubtext}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <p>Software Engineer & Web Designer</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Preloader Animation */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            className={styles.preloader}
            exit={{ opacity: 0 }}
          >
            <div className={styles.preloaderLogo}>AZ</div>
            <div className={styles.preloaderBar}>
              <motion.div 
                className={styles.preloaderProgress}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Content */}
      <AnimatePresence mode="wait">
        {showPortfolio && (
          <motion.div 
            className={styles.portfolioWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Enhanced 3D Background */}
            <EnhancedBackground color={currentTheme === 'dark' ? "#0a0a0a" : "#f5f5f5"} />
            
            {/* Margiela-inspired Header */}
            <Header activeSection={activeSection} />

            {/* Portfolio Content */}
            <div ref={portfolioContent} className={styles.portfolioContent}>
              {/* Hero Section */}
              <section id="home" className={styles.heroSection}>
                <FloatingElement amplitude={20} speed={6} className={styles.heroFloatingElement}>
                  <div className={styles.heroSubtitle}>Portfolio 2025</div>
                </FloatingElement>
                
                <div className={styles.heroContent}>
                  <RevealText delay={0.3} direction="up">
                    <h1 className={styles.heroTitle}>
                      Engineering elegant solutions for complex problems
                    </h1>
                  </RevealText>
                  
                  <RevealText delay={0.6} direction="up">
                    <p className={styles.heroDescription}>
                      Full-stack developer specializing in creating immersive digital experiences that merge innovation with aesthetics
                    </p>
                  </RevealText>
                  
                  <div className={styles.heroButtons}>
                    <motion.a 
                      href="#work" 
                      className={styles.primaryButton}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ y: 0 }}
                    >
                      View Projects
                    </motion.a>
                    
                    <motion.a 
                      href="#contact" 
                      className={styles.secondaryButton}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ y: 0 }}
                    >
                      Contact Me
                    </motion.a>
                  </div>
                </div>
                
                <div className={styles.scrollIndicator}>
                  <div className={styles.mouseIcon}></div>
                  <p>Scroll Down</p>
                </div>
              </section>
              
              {/* About Section with Profile */}
              <section id="about" className={styles.about}>
                <ProfileSection />
              </section>
              
              {/* Resume Section with Skills Integration */}
              <EnhancedResumeSection />
              
              {/* Work Section */}
              <WorkSection />
              
              {/* Contact Section */}
              <ContactSection />
              
              {/* Footer */}
              <footer className={styles.footer}>
                <div className={styles.footerContent}>
                  <div className={styles.footerLeft}>
                    <div className={styles.footerLogo}>AZ</div>
                    <p className={styles.copyright}>© {new Date().getFullYear()} Anthony Zhou</p>
                  </div>
                  
                  <div className={styles.footerLinks}>
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#resume">Resume</a>
                    <a href="#work">Work</a>
                    <a href="#contact">Contact</a>
                  </div>
                  
                  <div className={styles.footerRight}>
                    <div className={styles.socialLinks}>
                      <a href="https://github.com/developer-az" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      </a>
                      <a href="https://linkedin.com/in/anthony--zhou" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                    </div>
                    
                    <button 
                      className={styles.scrollTopButton}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        });
                      }}
                      aria-label="Scroll to top"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}