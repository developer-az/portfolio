"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import Preloader from "../components/Preloader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Import new enhanced components
import EnhancedBackground from '../components/EnhancedBackground';
import ProfileSection from '../components/ProfileSection';
import ProjectCard from '../components/ProjectCard';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Refs for GSAP animations
  const header = useRef(null);
  const portfolioContent = useRef(null);

  // Project data with original projects and descriptions
  const projects = [
    {
      title: "Instagram Analyzer",
      description: "Web-based Instagram Analytics Tool. Analyze who doesn't follow you back on Instagram.",
      technologies: ["React", "Next.js", "JavaScript"],
      demoLink: "/instagram-analyzer",
      repoLink:"/instagram-analyzer",
      iconLabel: "Instagram Analytics",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    }
    ,
    {
      title: "OnlineTest",
      description: "OnlineTest.zip file, Java Class Project For CMSC132.",
      technologies: ["Java", "OOP", "MVC", "University Project"],
      // No repoLink since it's a private repo
      iconLabel: "Java Application",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-3a2 2 0 0 0-2 2v.5"></path>
        <path d="M14 10.5V14a2 2 0 0 0 2 2h3"></path>
        <path d="M14 14h3"></path>
        <path d="M3 7.5h8"></path>
        <path d="M3 10.5h3"></path>
        <path d="M3 13.5h3"></path>
        <path d="M16 3.5A2.5 2.5 0 0 0 13.5 1h-3A2.5 2.5 0 0 0 8 3.5"></path>
        <path d="M16 20.5a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5"></path>
      </svg>
    },
    {
      title: "Simple-Social-Media-Clone",
      description: "Using HTML,CSS, and JavaScript to make a social media clone",
      technologies: ["HTML", "CSS", "JavaScript"],
      repoLink: "https://github.com/developer-az/Simple-Social-Media-Clone",
      iconLabel: "Social Media Platform",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.7 21a2 2 0 0 1-3.4 0"></path>
      </svg>
    },
    {
      title: "pyFollowerVsFollowing",
      description: "A python program that uses the html files given by the data from Instagram in order to find people who you follow but don't follow you back.",
      technologies: ["Python", "HTML", "Data Analysis"],
      repoLink: "https://github.com/developer-az/pyFollowerVsFollowing",
      // Removed demoLink for pyFollowerVsFollowing
      iconLabel: "Python Data Analysis",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"></path>
        <path d="M12 15h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"></path>
        <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z"></path>
      </svg>
    }
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

  // Add animations after portfolio is visible
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
          backgroundColor: "rgba(18, 18, 18, 0.95)",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
        });
      }
    }
  }, [showPortfolio]);

  // Mouse tracking for intro effect
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Navigation component to use in the main page.js file
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
        <a href="#work" className={styles.navLink}>Work</a>
        <a href="#contact" className={styles.navLink}>Contact</a>
        <Link href="/instagram-analyzer" className={styles.navLink}>
          Instagram Analyzer
        </Link>
      </div>
    );
  };

  // Mobile menu version with the same conditional logic
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
          <EnhancedBackground color="#121212" />
          
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
            
            {/* Leadership Section - Updated with both positions */}
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