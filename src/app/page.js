"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from '@/context/ThemeContext';
import dynamic from 'next/dynamic';

// Static imports for critical components
import Preloader from "../components/Preloader";
import FloatingNav from '../components/FloatingNav';
import EnhancedBackground from '../components/EnhancedBackground';

// Dynamic imports with code splitting for non-critical components
const ProfileSection = dynamic(() => import('../components/ProfileSection'), { ssr: true });
const WorkSection = dynamic(() => import('../components/WorkSection'), { ssr: true });
const ContactSection = dynamic(() => import('../components/ContactSection'), { ssr: true });
const SkillsSection = dynamic(() => import('../components/SkillsSection'), { ssr: true });
const ResumeSection = dynamic(() => import('../components/ResumeSection'), { ssr: true });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  
  const { mounted } = useTheme();
  const portfolioContent = useRef(null);
  
  // Mouse tracking for intro effect
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Setup scroll triggers
  const registerScrollTriggers = useCallback(() => {
    if (!portfolioContent.current) return;
    
    // Use GSAP ScrollTrigger for smoother section tracking
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id),
        onLeaveBack: () => {
          if (section.id === "about") {
            setActiveSection("about");
          }
        }
      });
    });
  }, []);

  // Initialize GSAP and handle loading sequence
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  
    // Optimize loading sequence with shorter times
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
      
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        
        const showTimer = setTimeout(() => {
          document.body.style.visibility = 'hidden';
          setShowPortfolio(true);
          
          setTimeout(() => {
            setIsFadingOut(false);
            document.body.style.overflow = "auto";
            document.body.style.height = 'auto';
            document.body.style.visibility = 'visible';
            registerScrollTriggers();
          }, 100);
        }, 600);
        
        return () => clearTimeout(showTimer);
      }, 1000);
      
      return () => clearTimeout(fadeTimer);
    }, 1200);
  
    return () => {
      clearTimeout(loadTimer);
      
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [registerScrollTriggers]);

  // Optimize scroll handling with throttling
  useEffect(() => {
    if (!showPortfolio) return;
    
    let lastScrollTime = 0;
    const throttleTime = 100;
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleTime) return;
      lastScrollTime = now;
      
      const scrollPosition = window.scrollY;
      
      if (scrollPosition < 100) {
        setActiveSection("about");
        return;
      }
      
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
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPortfolio]);

  // Show loading indicator while theme is mounting
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
          {/* Enhanced 3D Background - optimized with better performance settings */}
          <EnhancedBackground />
          
          {/* Floating Navigation */}
          <FloatingNav activeSection={activeSection} />

          {/* Portfolio Content */}
          <div ref={portfolioContent} className={styles.portfolioContent}>
            {/* Main Sections - simplified structure for better performance */}
            <section id="about" className={styles.about}>
              <ProfileSection />
            </section>
            
            <section id="skills">
              <SkillsSection />
            </section>
            
            <ResumeSection />
            
            <WorkSection />
            
            <ContactSection />
            
            {/* Simplified Footer */}
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