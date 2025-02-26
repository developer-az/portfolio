"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import Preloader from "../components/Preloader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Refs for GSAP animations
  const header = useRef(null);
  const portfolioContent = useRef(null);
  const mainWrapper = useRef(null);
  const locomotiveScrollRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP plugins
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Fix for initial scroll position
    window.scrollTo(0, 0);
    
    // Before starting, make sure body is prepared for the intro animation
    if (!showPortfolio) {
      document.body.style.overflow = 'hidden';
    }

    // Load locomotive scroll and run intro animations
    (async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        locomotiveScrollRef.current = new LocomotiveScroll();

        setTimeout(() => {
          setIsLoading(false);
          document.body.style.cursor = "default";
          
          // After loading is complete, start fade-out first, then show portfolio
          setTimeout(() => {
            // Start fade-out animation
            setIsFadingOut(true);
            
            // After fade-out completes, show portfolio
            setTimeout(() => {
              setShowPortfolio(true);
              setIsFadingOut(false);

              // Make sure the body is scrollable when portfolio is shown
              document.body.style.overflow = "auto";
              document.body.style.height = "auto";

                              // Re-initialize locomotive scroll for the portfolio content
              if (mainWrapper.current) {
                if (locomotiveScrollRef.current) {
                  locomotiveScrollRef.current.destroy();
                }
                
                try {
                  // Initialize Locomotive Scroll
                  locomotiveScrollRef.current = new LocomotiveScroll({
                    el: mainWrapper.current,
                    smooth: true,
                    smoothMobile: false,
                    resetNativeScroll: true,
                  });
                  
                  // For newer versions of Locomotive Scroll (v4+)
                  if (locomotiveScrollRef.current.scroll && typeof locomotiveScrollRef.current.scroll.on === 'function') {
                    locomotiveScrollRef.current.scroll.on("scroll", ScrollTrigger.update);
                  } 
                  // For older versions
                  else if (typeof locomotiveScrollRef.current.on === 'function') {
                    locomotiveScrollRef.current.on("scroll", ScrollTrigger.update);
                  }
                  
                  // Alternative ScrollTrigger integration without relying on Locomotive events
                  window.addEventListener('scroll', () => {
                    ScrollTrigger.update();
                  });
                  
                  // Simplified ScrollTrigger proxy
                  ScrollTrigger.scrollerProxy(mainWrapper.current, {
                    scrollTop(value) {
                      if (arguments.length) {
                        return 0;
                      }
                      return window.scrollY;
                    },
                    getBoundingClientRect() {
                      return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                      };
                    },
                  });
                } catch (err) {
                  console.error("Locomotive scroll init error:", err);
                  // Fallback to native scrolling if Locomotive fails
                }
              }
            }, 1000); // Increased from 500ms to 1000ms to ensure fade completes
          }, 2000); // Show intro for 2 seconds before starting fade
        }, 2000);
      } catch (error) {
        console.error("Failed to initialize locomotive scroll:", error);
        // Fallback if locomotive scroll fails
        setIsLoading(false);
        setShowPortfolio(true);
        document.body.style.overflow = "auto";
      }
    })();

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        try {
          if (locomotiveScrollRef.current) {
            if (typeof locomotiveScrollRef.current.destroy === 'function') {
              locomotiveScrollRef.current.destroy();
            }
            locomotiveScrollRef.current = null;
          }
          
          // Remove scroll event listener
          window.removeEventListener('scroll', ScrollTrigger.update);
          
          // Kill all ScrollTrigger instances
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      }
    };
  }, []);

  // Setup animations for portfolio sections
  useEffect(() => {
    if (showPortfolio && portfolioContent.current) {
      // Modify header animation to be less invasive
      const headerAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: portfolioContent.current,
          start: "top top",
          end: "100 top",
          scrub: 1, // Slower, smoother transition
        },
      });

      if (header.current) {
        headerAnimation.to(header.current, {
          backgroundColor: "rgba(18, 18, 18, 0.95)", // Dark with high opacity
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)", // Stronger shadow for dark theme
        });
      }

      // Modify section animations for better visibility
      const sections = portfolioContent.current.querySelectorAll("section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          {
            y: 30, // Reduced vertical movement
            opacity: 0.8, // Start with more visibility
          },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 85%", // Trigger slightly later
              end: "bottom 15%", // End slightly earlier
              scrub: 0.3, // Smoother scrubbing
            },
          }
        );
      });
    }
  }, [showPortfolio]);

  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Simple navigation component with matching style from the screenshot
  const SimpleNav = () => (
    <div className={styles.nav}>
      <a href="#about" className={styles.navLink}>
        About
      </a>
      <a href="#work" className={styles.navLink}>
        Work
      </a>
      <a href="#contact" className={styles.navLink}>
        Contact
      </a>
      <Link href="/instagram-analyzer" className={styles.navLink}>
        Instagram Analyzer
      </Link>
    </div>
  );

  // Simple mobile menu
  const SimpleMobileMenu = () => (
    <div
      className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}
    >
      <div className={styles.mobileMenuContent}>
        <a href="#about" onClick={() => setMobileMenuOpen(false)}>
          About
        </a>
        <a href="#work" onClick={() => setMobileMenuOpen(false)}>
          Work
        </a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
          Contact
        </a>
        <Link href="/instagram-analyzer" onClick={() => setMobileMenuOpen(false)}>
          Instagram Analyzer
        </Link>
      </div>
    </div>
  );

  return (
    <div className={styles.mainWrapper} ref={mainWrapper}>
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
          {/* Header */}
          <header ref={header} className={styles.header}>
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
              <SimpleNav />

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
            <SimpleMobileMenu />
          </header>

          {/* Portfolio Content */}
          <div ref={portfolioContent} className={styles.portfolioContent}>
            {/* Hero Section with About Me First */}
            <section id="about" className={styles.about}>
              <h2>About Me</h2>
              <div className={styles.aboutContent}>
                <div className={styles.aboutImage}>
                  <div style={{ backgroundColor: 'white', borderRadius: '50%', display: 'inline-block' }}>
                    <Image
                      src="/images/img.jpg"
                      alt="Anthony Zhou"
                      width={450}
                      height={450}
                      className={styles.profilePicture}
                      style={{ borderRadius: '50%', display: 'block' }} /* Added rounded image style */
                    />
                  </div>
                </div>
                <div className={styles.aboutText}>
                  <p>
                    Hi, I&apos;m Anthony Zhou, a passionate software engineer
                    and web designer dedicated to creating innovative digital
                    experiences.
                  </p>
                  <p>
                    With a strong background in full-stack development and UI/UX
                    design, I bring technical expertise and creative
                    problem-solving to every project.
                  </p>
                  <div className={styles.skills}>
                    <span>Python</span>
                    <span>Java</span>
                    <span>React</span>
                    <span>Next.js</span>
                    <span>UI/UX Design</span>
                    <span>Javascript</span>
                    <span>HTML</span>
                    <span>CSS</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Introduction Section - Reduced height */}
            <section className={styles.hero} style={{ padding: '1.5rem 0' }}>
              <h2>Software Engineer & Web Designer</h2>
              <p>
                I build engaging digital experiences that merge innovation with
                aesthetics.
              </p>
            </section>

            {/* Work Section */}
            <section id="work" className={styles.work}>
              <h2>Selected Work</h2>
              <div className={styles.projectGrid}>
                {/* Project 1 - pyFollowerVsFollowing */}
                <div className={styles.project}>
                  <div className={styles.projectImage}>
                    <div className={styles.projectImageContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6 0 0 0 0 0 0z"></path>
                        <polygon points="10 15 15 12 10 9"></polygon>
                      </svg>
                      <span className={styles.projectImageLabel}>Python Data Visualization</span>
                    </div>
                  </div>
                  <h3>pyFollowerVsFollowing</h3>
                  <p>
                    Full Stack Python Data Visualization Project (February –
                    April 2024)
                    <br />• Created a data visualization tool for Instagram
                    follower insights • 90%+ data accuracy through HTML file
                    pattern recognition • Managed with GitHub, deployed on
                    Vercel, hosted on Cloudflare • Created a User Guide video
                    with 200+ views
                  </p>
                </div>

                {/* Project 2 - OnlineTest */}
                <div className={styles.project}>
                  <div className={styles.projectImage}>
                    <div className={styles.projectImageContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7h-3a2 2 0 0 0-2 2v.5"></path>
                        <path d="M14 10.5V14a2 2 0 0 0 2 2h3"></path>
                        <path d="M14 14h3"></path>
                        <path d="M3 7.5h8"></path>
                        <path d="M3 10.5h3"></path>
                        <path d="M3 13.5h3"></path>
                        <path d="M16 3.5A2.5 2.5 0 0 0 13.5 1h-3A2.5 2.5 0 0 0 8 3.5"></path>
                        <path d="M16 20.5a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5"></path>
                      </svg>
                      <span className={styles.projectImageLabel}>Java Application</span>
                    </div>
                  </div>
                  <h3>OnlineTest</h3>
                  <p>
                    Object-Oriented Methodology Project (August 2024)
                    <br />• Implemented MVC architecture in Java • Developed
                    robust online test-tracking system • Applied advanced OOP
                    concepts: inheritance, polymorphism • Rigorous unit testing
                    and debugging
                  </p>
                </div>

                {/* Project 3 - Social Media Z */}
                <div className={styles.project}>
                  <div className={styles.projectImage}>
                    <div className={styles.projectImageContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.7 21a2 2 0 0 1-3.4 0"></path>
                      </svg>
                      <span className={styles.projectImageLabel}>Social Media Platform</span>
                    </div>
                  </div>
                  <h3>Social Media Z</h3>
                  <p>
                    Frontend Web Development Project (December 2023)
                    <br />• Built social media simulation app • Used vanilla
                    HTML, CSS, and JavaScript • Applied UX design principles •
                    Conducted user experience surveys
                  </p>
                </div>

                {/* Project 4 - Instagram Follower Analyzer */}
                <div className={styles.project}>
                  <div className={styles.projectImage}>
                    <div className={styles.projectImageContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      <span className={styles.projectImageLabel}>Instagram Analytics</span>
                    </div>
                  </div>
                  <h3>Instagram Follower Analyzer</h3>
                  <p>
                    Web-based Instagram Analytics Tool (February 2024)
                    <br />• Analyze who doesn't follow you back on Instagram •
                    Convert of Python data analysis project to JavaScript •
                    Process Instagram HTML files securely in the browser • Built
                    with Next.js and React with responsive design
                  </p>
                  <Link
                    href="/instagram-analyzer"
                    className={styles.projectLink}
                  >
                    Try it Now
                  </Link>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className={styles.contact}>
              <h2>Get In Touch</h2>
              <p>
                Interested in working together? Let&apos;s build something
                amazing.
              </p>
              <a
                href="mailto:88anthonyzhou@gmail.com"
                className={styles.contactButton}
              >
                Say Hello
              </a>
              <div className={styles.socialLinks}>
                <a
                  href="https://www.linkedin.com/in/anthony--zhou"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/developer-az"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.instagram.com/anthonyyzhou"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram
                </a>
              </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
              <p>© 2025 Anthony Zhou - All Rights Reserved</p>
              <p>Built with Next.js, Framer Motion, and GSAP</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}