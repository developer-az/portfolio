"use client";
import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";

// Static imports for critical components
import Preloader from "../components/Preloader";
import FloatingNav from '../components/FloatingNav';

// Dynamic imports with optimized loading
const EnhancedBackground = dynamic(() => import('../components/EnhancedBackground'), { 
  ssr: false,
  loading: () => <div className={styles.backgroundLoader} />
});

// Lazily load less critical sections
const ProfileSection = lazy(() => import('../components/ProfileSection'));
const WorkSection = lazy(() => import('../components/WorkSection'));
const ContactSection = lazy(() => import('../components/ContactSection'));
const SkillsSection = lazy(() => import('../components/SkillsSection'));
const ResumeSection = lazy(() => import('../components/ResumeSection'));

// Loading component for suspense fallback
const SectionLoader = () => (
  <div className={styles.sectionLoader}>
    <div className={styles.sectionLoaderSpinner}></div>
  </div>
);

export default function Home() {
  // State management - combined related states
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    showPortfolio: false,
    isFadingOut: false
  });
  const [activeSection, setActiveSection] = useState("about");
  
  // Refs
  const portfolioContent = useRef(null);
  const sectionsRef = useRef({});
  const observerRef = useRef(null);
  
  // Mouse tracking for intro effect with performance optimization
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Handle loading sequence with optimized timing
  useEffect(() => {
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    // Optimized loading sequence
    const loadingTimer = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
      
      const fadeTimer = setTimeout(() => {
        setLoadingState(prev => ({ ...prev, isFadingOut: true }));
        
        const showTimer = setTimeout(() => {
          // Reset body styles before showing portfolio
          document.body.style.visibility = 'hidden';
          
          setLoadingState({
            isLoading: false,
            isFadingOut: false,
            showPortfolio: true
          });
          
          // Restore body styles after state update
          setTimeout(() => {
            document.body.style.overflow = "auto";
            document.body.style.visibility = 'visible';
            setupIntersectionObserver();
          }, 50);
        }, 600);
        
        return () => clearTimeout(showTimer);
      }, 1000);
      
      return () => clearTimeout(fadeTimer);
    }, 1200);
  
    return () => {
      clearTimeout(loadingTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Setup intersection observer for scroll tracking
  const setupIntersectionObserver = useCallback(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.25
    };
    
    // Cleanup previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    }, options);
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      observerRef.current.observe(section);
      sectionsRef.current[section.id] = section;
    });
  }, []);

  // Handle scroll to top button
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className={styles.mainWrapper}>
      {/* Preloader Animation */}
      <AnimatePresence mode="wait">
        {loadingState.isLoading && <Preloader />}
      </AnimatePresence>

      {/* Initial Intro Effect */}
      {!loadingState.showPortfolio && !loadingState.isLoading && (
        <main className={`${styles.main} ${loadingState.isFadingOut ? styles.fadeOut : ''}`}>
          <motion.div
            className={styles.mask}
            animate={{
              WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
              WebkitMaskSize: `${size}px`,
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
          >
            <p
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
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
      {loadingState.showPortfolio && (
        <div className={styles.portfolioWrapper}>
          {/* Enhanced Background with lazy loading */}
          <EnhancedBackground />
          
          {/* Floating Navigation */}
          <FloatingNav activeSection={activeSection} />

          {/* Portfolio Content */}
          <div ref={portfolioContent} className={styles.portfolioContent}>
            {/* Main Sections with Suspense for lazy loading */}
            <Suspense fallback={<SectionLoader />}>
              <section id="about" className={styles.about} ref={el => sectionsRef.current.about = el}>
                <ProfileSection />
              </section>
              
              <section id="skills" ref={el => sectionsRef.current.skills = el}>
                <SkillsSection />
              </section>
              
              <section id="resume" ref={el => sectionsRef.current.resume = el}>
                <ResumeSection />
              </section>
              
              <section id="work" ref={el => sectionsRef.current.work = el}>
                <WorkSection />
              </section>
              
              <section id="contact" ref={el => sectionsRef.current.contact = el}>
                <ContactSection />
              </section>
            </Suspense>
            
            {/* Optimized Footer */}
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
                    onClick={scrollToTop}
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