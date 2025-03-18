"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import Preloader from "../components/Preloader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Import all components including ResumeSection
import EnhancedBackground from '../components/EnhancedBackground';
import ProfileSection from '../components/ProfileSection';
import ProjectCard from '../components/ProjectCard';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';
import ResumeSection from '../components/ResumeSection';

// Remove the direct import of useTheme for now
// import { useTheme } from '@/context/ThemeContext';

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

  // Project data remains the same as before
  const projects = [
    // ... your existing projects array
  ];

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

  // Handle scroll to update active section (same as before)
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

  // Mouse tracking for intro effect (same as before)
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Navigation components (add resume links as in the previous solution)
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
        <a href="#about" className={styles.navLink}>About</a>
        <a href="#skills" className={styles.navLink}>Skills</a>
        <a href="#resume" className={styles.navLink}>Resume</a>
        <a href="#work" className={styles.navLink}>Work</a>
        <a href="#contact" className={styles.navLink}>Contact</a>
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
            {/* Hero Section with Profile */}
            <section id="about" className={styles.about}>
              <ProfileSection />
            </section>
            
            {/* Skills Section */}
            <SkillsSection />
            
            {/* Resume Section - Added here */}
            <ResumeSection />
            
            {/* Work Section */}
            <section id="work" className={styles.work}>
              <div className={styles.container}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Selected Work</h2>
                  <p className={styles.sectionDescription}>
                    Explore my latest projects showcasing my skills and expertise in web development and software engineering.
                  </p>
                </div>
                
                <div className={styles.projectGrid}>
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      title={project.title}
                      description={project.description}
                      technologies={project.technologies}
                      demoLink={project.demoLink}
                      repoLink={project.repoLink}
                      icon={project.icon}
                      iconLabel={project.iconLabel}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className={styles.decorativeElement1}></div>
              <div className={styles.decorativeElement2}></div>
            </section>
            
            {/* Leadership Section */}
            <section id="leadership" className={styles.leadership}>
              <div className={styles.container}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Leadership & Community</h2>
                  <p className={styles.sectionDescription}>
                    Beyond technical skills, I'm committed to leadership and community engagement.
                  </p>
                </div>
                
                {/* Teaching Assistant Position */}
                <div className={styles.leadershipCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.roleIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </div>
                    <div className={styles.roleInfo}>
                      <h3>Undergraduate Teaching Assistant</h3>
                      <p className={styles.organization}>Financial Literacy and Stocks (BSOS201)</p>
                      <p className={styles.duration}>College Park, MD • August 2024 - Present</p>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <ul className={styles.responsibilities}>
                      <li>Supported students in grasping stock market trends, Technical Analysis, & Portfolio Management as a Grading & Teaching Assistant utilizing Excel</li>
                      <li>Engineered the integration of financial modeling software & data visualization tools (TC2000 & IBD) for fall 2024 students, resulting in a +15% surge in personal portfolio performance compared to the previous year</li>
                    </ul>
                  </div>
                </div>
                
                {/* Orientation Advisor Position */}
                <div className={styles.leadershipCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.roleIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className={styles.roleInfo}>
                      <h3>Orientation Advisor</h3>
                      <p className={styles.organization}>College of Computer, Mathematical, and Natural Sciences</p>
                      <p className={styles.duration}>College Park, MD • May 2024 - January 2025</p>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <ul className={styles.responsibilities}>
                      <li>Facilitated the initial steps for incoming students at the university, offering guidance to over 200 individuals per session using resource guides</li>
                      <li>Cultivated an inclusive & inviting environment to ensure a seamless transition for new students</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
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
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}
                    aria-label="Scroll to top"
                    className={styles.scrollTopButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}