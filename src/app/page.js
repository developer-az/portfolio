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
import AnimatedBackground from '../components/AnimatedBackground';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

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
  }, [showPortfolio]); // Added showPortfolio to dependencies

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

      // Simple fade-in animations for sections
      const sections = portfolioContent.current.querySelectorAll("section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 50%",
              scrub: 0.5,
            },
          }
        );
      });
    }
  }, [showPortfolio]);

  // Mouse tracking for intro effect
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  // Simple navigation component
  const SimpleNav = () => (
    <div className={styles.nav}>
      <a href="#about" className={styles.navLink}>About</a>
      <a href="#work" className={styles.navLink}>Work</a>
      <a href="#contact" className={styles.navLink}>Contact</a>
      <Link href="/instagram-analyzer" className={styles.navLink}>Instagram Analyzer</Link>
    </div>
  );

  // Mobile menu
  const SimpleMobileMenu = () => (
    <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}>
      <div className={styles.mobileMenuContent}>
        <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
        <a href="#work" onClick={() => setMobileMenuOpen(false)}>Work</a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        <Link href="/instagram-analyzer" onClick={() => setMobileMenuOpen(false)}>
          Instagram Analyzer
        </Link>
      </div>
    </div>
  );

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
          <AnimatedBackground /> 
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
            {/* About Me Section */}
            <section id="about" className={styles.about}>
              <h2>About Me</h2>
              <div className={styles.aboutContent}>
                {/* Profile Photo in Oval Container */}
                <div className={styles.profileContainer}>
                  <Image
                    src="/images/new-profile.png"
                    alt="Anthony Zhou"
                    width={400} 
                    height={400}
                    className={styles.profileImage}
                    priority
                  />
                </div>

                {/* About Text and Resume Info */}
                <div className={styles.aboutInfo}>
                  <p>
                    Hi, I&apos;m Anthony Zhou, a passionate software engineer and web designer dedicated to 
                    creating innovative digital experiences.
                  </p>
                  <p>
                    With a strong background in full-stack development and UI/UX design, I bring technical 
                    expertise and creative problem-solving to every project.
                  </p>
                  
                  {/* Education Section */}
                  <div className={styles.resumeSection}>
                    <h3><span className={styles.icon}>🎓</span> Education</h3>
                    <div className={styles.educationInfo}>
                      <div className={styles.schoolInfo}>
                        <h4>University of Maryland</h4>
                        <p className={styles.degree}>Bachelor of Science - Computer Science, Data Science Track</p>
                        <p className={styles.minor}>Minor: Information Risk Management, Ethics, and Privacy</p>
                        <p className={styles.location}>College Park, MD • Graduation: May 2027</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Technical Skills Section with Icons */}
                  <div className={styles.resumeSection}>
                    <h3><span className={styles.icon}>💻</span> Technical Skills</h3>
                    <div className={styles.skillsContainer}>
                      {/* Programming Languages */}
                      <div className={styles.skillsCategory}>
                        <h4 className={styles.categoryTitle}>Programming Languages</h4>
                        <div className={styles.skills}>
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"></path>
                              <path d="M12 15h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"></path>
                              <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z"></path>
                            </svg>
                            <span>Python</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7.5a2.5 2.5 0 0 0-5 0V12a5 5 0 0 1-10 0Z"></path>
                            </svg>
                            <span>Java</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.8 20A9 9 0 1 0 6.2 20"></path>
                              <path d="M12 13V2"></path>
                            </svg>
                            <span>JavaScript</span>
                          </div>

                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 8c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4Z"></path>
                              <path d="M9 11h.01"></path>
                              <path d="M14 11h.01"></path>
                            </svg>
                            <span>C</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m13 4 1.5 9h-4L12 4"></path>
                              <path d="M8 15h8"></path>
                              <path d="M14 19v-3"></path>
                              <path d="M10 19v-3"></path>
                              <path d="M4 7V4h16v3"></path>
                              <path d="M4 7v13h16V7"></path>
                            </svg>
                            <span>HTML</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 2l2 19 6 2 6-2 2-19Z"></path>
                              <path d="M7 8h10l-1 8-4 2-4-2-.5-4"></path>
                            </svg>
                            <span>CSS</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Frameworks */}
                      <div className={styles.skillsCategory}>
                        <h4 className={styles.categoryTitle}>Frameworks & Libraries</h4>
                        <div className={styles.skills}>
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="2"></circle>
                              <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5A9.77 9.77 0 0 1 12 17a9.77 9.77 0 0 1-8.82-5.5A9.77 9.77 0 0 1 12 6z"></path>
                            </svg>
                            <span>React</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12h5"></path>
                              <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0Z"></path>
                              <path d="M17 12h4"></path>
                            </svg>
                            <span>Next.js</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 3v18h18"></path>
                              <path d="m19 9-5 5-4-4-3 3"></path>
                            </svg>
                            <span>Data Science</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Methodologies */}
                      <div className={styles.skillsCategory}>
                        <h4 className={styles.categoryTitle}>Methodologies & Tools</h4>
                        <div className={styles.skills}>
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 3h6v4l-2 2H3V3Z"></path>
                              <path d="M14 3h7v6h-7V3Z"></path>
                              <path d="M10 21V8L8 6"></path>
                              <path d="M17.5 15.5 19 19h-6l1.5-3.5"></path>
                              <path d="M14 3v4"></path>
                              <path d="M14 21h7v-6h-7v6Z"></path>
                            </svg>
                            <span>OOP</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                              <path d="M10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                              <path d="M17 24a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                              <path d="M10 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                              <path d="M3 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                              <path d="M3 24a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                            </svg>
                            <span>Agile/Scrum</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            <span>GitHub</span>
                          </div>
                          
                          <div className={styles.skillItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                              <line x1="9" y1="9" x2="9.01" y2="9"></line>
                              <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                            <span>UI/UX Design</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience Section */}
                  <div className={styles.resumeSection}>
                    <h3><span className={styles.icon}>💼</span> Work Experience</h3>
                    <div className={styles.workContainer}>
                      <div className={styles.workItem}>
                        <h4>Undergraduate Teaching Assistant</h4>
                        <p className={styles.workDetails}>Financial Literacy and Stocks (BSOS201)</p>
                        <p className={styles.workLocation}>College Park, MD • August 2024 - Present</p>
                        <ul className={styles.workResponsibilities}>
                          <li>Supported students in grasping stock market trends, Technical Analysis, & Portfolio Management as a Grading & Teaching Assistant utilizing Excel</li>
                          <li>Engineered the integration of financial modeling software & data visualization tools (TC2000 & IBD) for fall 2024 students, resulting in a +15% surge in personal portfolio performance compared to the previous year</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

            {/* Leadership Section */}
            <section id="leadership" className={styles.leadership}>
              <h2>Leadership & Community</h2>
              <div className={styles.leadershipItem}>
                <h3>Orientation Advisor</h3>
                <p className={styles.leadershipDetails}>College of Computer, Mathematical, and Natural Sciences</p>
                <p className={styles.leadershipLocation}>College Park, MD • May 2024 - January 2025</p>
                <ul className={styles.leadershipResponsibilities}>
                  <li>Facilitated the initial steps for incoming students at the university, offering guidance to over 200 individuals per session using resource guides</li>
                  <li>Cultivated an inclusive & inviting environment to ensure a seamless transition for new students</li>
                </ul>
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
                href="mailto:azhou112@umd.edu"
                className={styles.contactButton}
              >
                Say Hello
              </a>
              <div className={styles.socialLinks}>
  <a
    href="https://www.linkedin.com/in/anthony--zhou"
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => {
      // Direct navigation without preventDefault
      window.open("https://www.linkedin.com/in/anthony--zhou", "_blank");
    }}
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
    onClick={(e) => {
      window.open("https://github.com/developer-az", "_blank");
    }}
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
    onClick={(e) => {
      window.open("https://www.instagram.com/anthonyyzhou", "_blank");
    }}
  >
    <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
    Instagram
  </a>
</div>
              <div className={styles.contactInfo}>
                <p>Columbia, MD | <a href="tel:2403905571">(240) 390-5571</a> | <a href="mailto:azhou112@umd.edu">azhou112@umd.edu</a></p>
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