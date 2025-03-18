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
// Add this at the top of Portfolio.jsx
import Image from 'next/image';

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
            
{/* About Section - Clean Implementation */}
<section id="about" className={styles.about}>
  <h2>About Me</h2>
  <div className={styles.aboutContent}>
    {/* Profile Image with Circular Container */}
    <div className={styles.aboutImage}>
  <div className={styles.circleContainer}>
    <Image
      src="/images/1.png"
      alt="Anthony Zhou"
      width={300}
      height={300}
      className={styles.profilePicture}
      style={{ 
        objectFit: 'cover',
        objectPosition: 'center top', // Adjust this value as needed
        width: '100%',
        height: '100%'
      }}
      priority
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
      
      {/* Technical Skills Section */}
      <div className={styles.skillsContainer}>
        <h3 className={styles.skillsTitle}>Technical Skills</h3>
        
        {/* Languages Category */}
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
        
        {/* Frameworks Category */}
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
        
        {/* Methodologies Category */}
        <div className={styles.skillsCategory}>
          <h4 className={styles.categoryTitle}>Methodologies</h4>
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