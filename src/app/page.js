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
import FloatingNav from '../components/FloatingNav';

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
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  
  // Use the theme context properly
  const { mounted } = useTheme();

  // Refs for GSAP animations
  const portfolioContent = useRef(null);
  
  // Setup scroll triggers as a separate function
  const registerScrollTriggers = useCallback(() => {
    if (!portfolioContent.current) return;
    
    // Update active section on scroll
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id),
        onLeaveBack: () => {
          // If scrolling back up past the first section, set active to "about"
          if (section.id === "about") {
            setActiveSection("about");
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    // Initialize GSAP plugins
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  
    // Fix for initial scroll position
    window.scrollTo(0, 0);
    
    // Set initial body overflow to hidden
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh'; // Force fullscreen height during loading
  
    // Optimize loading sequence
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
      
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        
        const showTimer = setTimeout(() => {
          // Prepare content before showing
          document.body.style.visibility = 'hidden';
          setShowPortfolio(true);
          
          // Allow a moment for the DOM to update
          setTimeout(() => {
            setIsFadingOut(false);
            document.body.style.overflow = "auto";
            document.body.style.height = 'auto'; // Reset height restriction
            document.body.style.visibility = 'visible';
            
            // Register scroll trigger for sections once portfolio is shown
            registerScrollTriggers();
          }, 100);
        }, 800);
        
        return () => clearTimeout(showTimer);
      }, 1500);
      
      return () => clearTimeout(fadeTimer);
    }, 1500);
  
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
      
      // Default to "about" when at the top of the page
      if (scrollPosition < 100) {
        setActiveSection("about");
        return;
      }
      
      // Find which section is currently in view based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let found = false;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
          found = true;
        }
      });
      
      // If no section is found in view and we're scrolled down, keep the last section
      if (!found && scrollPosition > 100) {
        // Do nothing, keep the current active section
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Call once on mount to set initial section
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPortfolio]);

  // Mouse tracking for intro effect - with memoization for performance
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

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
          {/* Enhanced 3D Background - always dark theme */}
          <EnhancedBackground color="#121212" />
          
          {/* Floating Navigation */}
          <FloatingNav activeSection={activeSection} />

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