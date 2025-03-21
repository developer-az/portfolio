import React, { useState, useEffect, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import styles from './PageTransitions.module.scss';

// Create context for page transitions
const PageTransitionContext = createContext({
  isAnimating: false,
  setIsAnimating: () => {},
});

// Export context hook for use in components
export const usePageTransition = () => useContext(PageTransitionContext);

// Main Page Transition Provider Component
export const PageTransitionProvider = ({ children }) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionType, setTransitionType] = useState('fade'); // Options: 'fade', 'slide', 'zoom', 'flip'

  // Handle route change start
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      // Extract the transition type from the URL if provided as a query param
      const urlObj = new URL(url, window.location.origin);
      const transType = urlObj.searchParams.get('transition');
      if (transType && ['fade', 'slide', 'zoom', 'flip'].includes(transType)) {
        setTransitionType(transType);
      } else {
        // Set a random transition for variety
        const transitions = ['fade', 'slide', 'zoom', 'flip'];
        setTransitionType(transitions[Math.floor(Math.random() * transitions.length)]);
      }
      setIsAnimating(true);
    };

    // Handle route change complete
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Adjust timing to match animation duration
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  // Update displayed children when actual children change and not animating
  useEffect(() => {
    if (!isAnimating) {
      setDisplayChildren(children);
    }
  }, [children, isAnimating]);

  // Animation variants
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 },
    },
    zoom: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 },
    },
    flip: {
      initial: { rotateY: 90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -90, opacity: 0 },
    },
  };

  // Shared transition settings
  const transition = {
    type: 'tween',
    ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier easing
    duration: 0.5,
  };

  return (
    <PageTransitionContext.Provider value={{ isAnimating, setIsAnimating }}>
      <div className={styles.pageContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants[transitionType]}
            transition={transition}
            className={styles.pageContent}
          >
            {displayChildren}
          </motion.div>
        </AnimatePresence>

        {/* Page transition overlay */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className={styles.pageOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.loaderContainer}>
                <div className={styles.loaderBar}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransitionContext.Provider>
  );
};

// Custom Link component that triggers page transitions
export const TransitionLink = ({ href, children, transition = null, className = '', onClick = () => {} }) => {
  const router = useRouter();
  const { setIsAnimating } = usePageTransition();

  const handleClick = (e) => {
    e.preventDefault();
    onClick();
    setIsAnimating(true);
    
    // Construct URL with transition parameter if provided
    let url = href;
    if (transition) {
      url = `${href}${href.includes('?') ? '&' : '?'}transition=${transition}`;
    }
    
    setTimeout(() => {
      router.push(url);
    }, 100);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// Section transition component for in-page animations
export const SectionTransition = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
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

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className={styles.sectionTransition}
    >
      {children}
    </motion.div>
  );
};

// Mouse reveal effect component (Margiela-style highlight)
export const MouseReveal = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className={styles.mouseRevealContainer}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.content}>
        {children}
      </div>
      <div 
        className={styles.revealMask}
        style={{
          opacity: isHovering ? 1 : 0,
          transform: `translate(${mousePosition.x - 75}px, ${mousePosition.y - 75}px)`
        }}
      ></div>
    </div>
  );
};

// Text reveal animation component
export const RevealText = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
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

  // Set animation direction
  const initialY = direction === 'up' ? 20 : direction === 'down' ? -20 : 0;
  const initialX = direction === 'left' ? 20 : direction === 'right' ? -20 : 0;

  return (
    <div className={styles.textRevealContainer} ref={ref}>
      <div className={styles.textContent}>
        {typeof children === 'string' ? (
          // If children is a string, animate each word separately
          <span className={styles.textWrapper}>
            {children.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                initial={{ opacity: 0, y: initialY, x: initialX }}
                animate={isVisible ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: initialY, x: initialX }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: delay + i * 0.05,
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        ) : (
          // Otherwise, animate the entire component
          <motion.div
            initial={{ opacity: 0, y: initialY, x: initialX }}
            animate={isVisible ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: initialY, x: initialX }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay,
            }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
};