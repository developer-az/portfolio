'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './style.module.scss';
import { opacity, slideUp } from './anim';
import Nav from './nav';
import Rounded from '../../common/RoundedButton';
import Magnetic from '../../common/Magnetic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import words from your existing intro component
const words = ["Hello", "Bonjour", "Hallå", "안녕하세요", "やあ", "Hola", "Guten tag", "你好!"];

export default function Portfolio() {
  // State for intro animation
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [showIntro, setShowIntro] = useState(true);
  const [isActive, setIsActive] = useState(false);
  
  // Refs for GSAP animations
  const header = useRef(null);
  const button = useRef(null);
  const portfolioContent = useRef(null);
  
  // Register ScrollTrigger with GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Set dimensions for the curve animation
  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Word cycling for intro animation
  useEffect(() => {
    if (index === words.length - 1) {
      // After showing all words, wait 1 second and then hide intro
      setTimeout(() => {
        setShowIntro(false);
      }, 1000);
      return;
    }
    
    setTimeout(() => {
      setIndex(index + 1);
    }, index === 0 ? 1000 : 150);
  }, [index]);

  // Setup scrolling effects after intro is hidden
  useEffect(() => {
    if (!showIntro && header.current && portfolioContent.current) {
      // Make header sticky on scroll with a fadeout effect
      const headerAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: portfolioContent.current,
          start: "top top",
          end: "100 top",
          scrub: true,
        }
      });
      
      headerAnimation.to(header.current, {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      });
      
      // Animate portfolio sections on scroll
      const sections = portfolioContent.current.querySelectorAll('section');
      sections.forEach((section, i) => {
        gsap.fromTo(section, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 0.5,
            }
          }
        );
      });
    }
  }, [showIntro]);

  // SVG path for intro animation curve
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  };

  return (
    <div className={styles.portfolioContainer}>
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            variants={slideUp} 
            initial="initial" 
            exit="exit" 
            className={styles.introduction}
          >
            {dimension.width > 0 && (
              <>
                <motion.p variants={opacity} initial="initial" animate="enter">
                  <span></span>{words[index]}
                </motion.p>
                <svg>
                  <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
                </svg>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navigation Header */}
      {!showIntro && (
        <>
          <div ref={header} className={styles.header}>
            <div className={styles.logo}>
              <p className={styles.copyright}>©</p>
              <div className={styles.name}>
                <p className={styles.codeBy}>Code by</p>
                <p className={styles.dennis}>Dennis</p>
                <p className={styles.snellenberg}>Snellenberg</p>
              </div>
            </div>
            <div className={styles.nav}>
              <Magnetic>
                <div className={styles.el}>
                  <a href="#work">Work</a>
                  <div className={styles.indicator}></div>
                </div>
              </Magnetic>
              <Magnetic>
                <div className={styles.el}>
                  <a href="#about">About</a>
                  <div className={styles.indicator}></div>
                </div>
              </Magnetic>
              <Magnetic>
                <div className={styles.el}>
                  <a href="#contact">Contact</a>
                  <div className={styles.indicator}></div>
                </div>
              </Magnetic>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div ref={button} className={styles.headerButtonContainer}>
            <Rounded onClick={() => {setIsActive(!isActive)}} className={`${styles.button}`}>
              <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
            </Rounded>
          </div>
          
          {/* Mobile Navigation Menu */}
          <AnimatePresence mode="wait">
            {isActive && <Nav />}
          </AnimatePresence>
          
          {/* Portfolio Content */}
          <div ref={portfolioContent} className={styles.portfolioContent}>
            {/* Hero Section */}
            <section className={styles.hero}>
              <h1>Creative Developer & Designer</h1>
              <p>I build engaging digital experiences that merge innovation with aesthetics.</p>
            </section>
            
            {/* Work Section */}
            <section id="work" className={styles.work}>
              <h2>Selected Work</h2>
              <div className={styles.projectGrid}>
                {/* Project 1 */}
                <div className={styles.project}>
                  <div className={styles.projectImage}></div>
                  <h3>Project Name</h3>
                  <p>Brief description of the project and technologies used.</p>
                </div>
                
                {/* Project 2 */}
                <div className={styles.project}>
                  <div className={styles.projectImage}></div>
                  <h3>Project Name</h3>
                  <p>Brief description of the project and technologies used.</p>
                </div>
                
                {/* Project 3 */}
                <div className={styles.project}>
                  <div className={styles.projectImage}></div>
                  <h3>Project Name</h3>
                  <p>Brief description of the project and technologies used.</p>
                </div>
              </div>
            </section>
            
            {/* About Section */}
            <section id="about" className={styles.about}>
              <h2>About Me</h2>
              <div className={styles.aboutContent}>
                <div className={styles.aboutImage}></div>
                <div className={styles.aboutText}>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget quam nec magna tristique dignissim. Fusce vulputate velit sit amet dui eleifend, sit amet hendrerit mauris sagittis.</p>
                  <p>Proin in ipsum sit amet dui faucibus dignissim. Nam eget orci a orci tempus vehicula. Sed ultrices neque eu leo feugiat, at tincidunt arcu hendrerit.</p>
                  <div className={styles.skills}>
                    <span>React</span>
                    <span>Next.js</span>
                    <span>Framer Motion</span>
                    <span>GSAP</span>
                    <span>UI/UX Design</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Contact Section */}
            <section id="contact" className={styles.contact}>
              <h2>Get In Touch</h2>
              <p>Interested in working together? Let&apos;s build something amazing.</p>
              <a href="mailto:your-email@example.com" className={styles.contactButton}>
                Say Hello
              </a>
              <div className={styles.socialLinks}>
                <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Dribbble</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </section>
            
            {/* Footer */}
            <footer className={styles.footer}>
              <p>© 2025 Your Name - All Rights Reserved</p>
              <p>Built with Next.js, Framer Motion, and GSAP</p>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}