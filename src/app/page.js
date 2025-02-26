"use client";
import styles from "./page.module.scss";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMousePosition from "./utils/useMousePosition";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    // Initialize GSAP plugins
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Load locomotive scroll and run intro animations
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);

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
              locomotiveScroll.destroy();
              const newScroll = new LocomotiveScroll({
                el: mainWrapper.current,
                smooth: true,
                smoothMobile: false,
                resetNativeScroll: true,
              });
            }
          }, 1000); // Increased from 500ms to 1000ms to ensure fade completes
        }, 2000); // Show intro for 2 seconds before starting fade
      }, 2000);
    })();

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly more transparent
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)", // Softer shadow
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
      <a href="#work" className={styles.navLink}>
        Work
      </a>
      <a href="#about" className={styles.navLink}>
        About
      </a>
      <a href="#contact" className={styles.navLink}>
        Contact
      </a>
    </div>
  );

  // Simple mobile menu
  const SimpleMobileMenu = () => (
    <div
      className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}
    >
      <div className={styles.mobileMenuContent}>
        <a href="#work" onClick={() => setMobileMenuOpen(false)}>
          Work
        </a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)}>
          About
        </a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
          Contact
        </a>
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
            {/* Hero Section */}
            <section className={styles.hero}>
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
                  <div className={styles.projectImage}></div>
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
                  <div className={styles.projectImage}></div>
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
                  <div className={styles.projectImage}></div>
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
                  <div className={styles.projectImage}></div>
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

            {/* About Section */}
            <section id="about" className={styles.about}>
              <h2>About Me</h2>
              <div className={styles.aboutContent}>
                <div className={styles.aboutImage}>
                  <Image
                    src="/images/img.jpg"
                    alt="Anthony Zhou"
                    width={450}
                    height={450}
                    className={styles.profilePicture}
                  />
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
                  LinkedIn
                </a>
                <a
                  href="https://github.com/developer-az"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://www.instagram.com/anthonyyzhou"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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