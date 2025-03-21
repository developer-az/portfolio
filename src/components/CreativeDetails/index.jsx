import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import styles from './CreativeDetails.module.scss';

// Custom text link with underline animation
export const AnimatedTextLink = ({ children, href, className = '', ...props }) => {
  return (
    <motion.a 
      href={href}
      className={`${styles.animatedTextLink} ${className}`}
      initial="initial"
      whileHover="hover"
      {...props}
    >
      <span className={styles.textContent}>{children}</span>
      <motion.span 
        className={styles.underline}
        variants={{
          initial: { width: '0%' },
          hover: { width: '100%' }
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.a>
  );
};

// Magnetic button effect (Margiela-inspired)
export const MagneticElement = ({ children, strength = 40, className = '', ...props }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform motion values to actual movement
  const transformX = useTransform(mouseX, (val) => val / strength);
  const transformY = useTransform(mouseY, (val) => val / strength);
  
  // Handle mouse position
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  
  // Reset position when not hovering
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };
  
  return (
    <motion.div 
      ref={ref}
      className={`${styles.magneticElement} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        x: isHovered ? transformX : 0,
        y: isHovered ? transformY : 0,
      }}
      {...props}
    >
      <div className={styles.magneticContent}>
        {children}
      </div>
    </motion.div>
  );
};

// Subtle parallax effect for images or elements
export const ParallaxElement = ({ children, speed = 0.3, direction = 'vertical', className = '' }) => {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Calculate transform based on scroll position and direction
  const transform = direction === 'vertical' 
    ? `translateY(${scrollY * speed}px)` 
    : `translateX(${scrollY * speed}px)`;
    
  return (
    <div className={`${styles.parallaxContainer} ${className}`} ref={ref}>
      <div 
        className={styles.parallaxContent}
        style={{ transform }}
      >
        {children}
      </div>
    </div>
  );
};

// Creative cursor effect
export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Update cursor position with smooth easing
    function animate() {
      // Cursor follows mouse position directly
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      
      // Follower follows with lag
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Mouse move handler
    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsActive(true);
    }
    
    // Mouse events
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', () => setIsClicking(true));
    document.addEventListener('mouseup', () => setIsClicking(false));
    document.addEventListener('mouseleave', () => setIsActive(false));
    
    // Handle hover over links
    const links = document.querySelectorAll('a, button, [role="button"], input[type="submit"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => setIsHoveringLink(true));
      link.addEventListener('mouseleave', () => setIsHoveringLink(false));
    });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', () => setIsClicking(true));
      document.removeEventListener('mouseup', () => setIsClicking(false));
      document.removeEventListener('mouseleave', () => setIsActive(false));
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', () => setIsHoveringLink(true));
        link.removeEventListener('mouseleave', () => setIsHoveringLink(false));
      });
    };
  }, []);
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className={`${styles.cursor} ${isActive ? styles.active : ''} ${isClicking ? styles.clicking : ''} ${isHoveringLink ? styles.hoveringLink : ''}`}
      />
      <div 
        ref={followerRef} 
        className={`${styles.cursorFollower} ${isActive ? styles.active : ''} ${isClicking ? styles.clicking : ''} ${isHoveringLink ? styles.hoveringLink : ''}`}
      />
    </>
  );
};

// Split text animation for headings
export const SplitTextAnimation = ({ children, type = 'words', className = '' }) => {
  const text = children.toString();
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const splitTextByType = () => {
    if (type === 'chars') {
      return text.split('').map((char, index) => (
        <motion.span
          key={`char-${index}`}
          className={styles.char}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.02
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }
    
    // Default to words
    return text.split(' ').map((word, index) => (
      <motion.span
        key={`word-${index}`}
        className={styles.word}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: index * 0.04
        }}
      >
        {word}
        {index < text.split(' ').length - 1 && '\u00A0'}
      </motion.span>
    ));
  };

  return (
    <motion.span
      ref={ref}
      className={`${styles.splitTextContainer} ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-label={text}
    >
      {splitTextByType()}
    </motion.span>
  );
};

// Minimal scroll progress indicator
export const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className={styles.scrollProgressContainer}>
      <div 
        className={styles.scrollProgressBar}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

// Image hover reveal effect
export const ImageRevealEffect = ({ src, alt, width, height, className = '' }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`${styles.imageRevealContainer} ${className}`}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className={styles.imageWrapper}
        initial={{ height: '0%' }}
        animate={{ height: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img 
          src={src} 
          alt={alt} 
          width={width} 
          height={height}
          initial={{ scale: 1.2 }}
          animate={{ scale: isHovered ? 1 : 1.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </div>
  );
};

// Floating element animation
export const FloatingElement = ({ children, className = '', amplitude = 10, speed = 3 }) => {
  return (
    <motion.div
      className={`${styles.floatingElement} ${className}`}
      animate={{
        y: [`-${amplitude}px`, `${amplitude}px`, `-${amplitude}px`],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Text highlight effect
export const TextHighlight = ({ children, className = '', color = 'primary' }) => {
  return (
    <span className={`${styles.textHighlight} ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};