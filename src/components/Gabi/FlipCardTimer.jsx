import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FlipCardTimer.module.scss';

// Format time with leading zeros
const formatTimeUnit = (unit) => {
  return unit.toString().padStart(2, '0');
};

// Individual FlipCard component
const FlipCard = ({ digit, label, prevDigit }) => {
  // Only animate when digit changes
  const shouldAnimate = prevDigit !== undefined && prevDigit !== digit;
  
  return (
    <div className={styles.flipUnitContainer}>
      <div className={styles.flipUnitLabel}>{label}</div>
      <div className={styles.flipUnit}>
        {/* Upper half of current digit */}
        <div className={styles.upperCard}>
          <span>{formatTimeUnit(digit)}</span>
        </div>
        
        {/* Lower half of current digit */}
        <div className={styles.lowerCard}>
          <span>{formatTimeUnit(digit)}</span>
        </div>
        
        {/* Animation cards */}
        <AnimatePresence>
          {shouldAnimate && (
            <motion.div 
              key={`upper-flip-${digit}`}
              className={styles.flipCardTop}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <span>{formatTimeUnit(prevDigit)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {shouldAnimate && (
            <motion.div 
              key={`lower-flip-${digit}`}
              className={styles.flipCardBottom}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
            >
              <span>{formatTimeUnit(digit)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FlipCardTimer = ({ timeSince }) => {
  const [prevTimeSince, setPrevTimeSince] = useState(null);
  
  // Update previous time values only when they change (for animation)
  useEffect(() => {
    if (prevTimeSince === null) {
      setPrevTimeSince(timeSince);
      return;
    }
    
    // Check if any value has changed
    const hasChanged = (
      prevTimeSince.days !== timeSince.days ||
      prevTimeSince.hours !== timeSince.hours ||
      prevTimeSince.minutes !== timeSince.minutes ||
      prevTimeSince.seconds !== timeSince.seconds
    );
    
    if (hasChanged) {
      setPrevTimeSince(timeSince);
    }
  }, [timeSince, prevTimeSince]);
  
  return (
    <motion.div 
      className={styles.timerContainer}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 1, ease: "easeOut" }}
    >
      <motion.div 
        className={styles.timerCard}
        whileHover={{ scale: 1.05, rotateX: 5 }}
      >
        <h3 className={styles.timerTitle}>
          Time Since We First Met
        </h3>
        <div className={styles.timerDigits}>
          <FlipCard 
            digit={timeSince.days} 
            label="Days" 
            prevDigit={prevTimeSince?.days}
          />
          <div className={styles.separator}>:</div>
          <FlipCard 
            digit={timeSince.hours} 
            label="Hours" 
            prevDigit={prevTimeSince?.hours}
          />
          <div className={styles.separator}>:</div>
          <FlipCard 
            digit={timeSince.minutes} 
            label="Minutes" 
            prevDigit={prevTimeSince?.minutes}
          />
          <div className={styles.separator}>:</div>
          <FlipCard 
            digit={timeSince.seconds} 
            label="Seconds" 
            prevDigit={prevTimeSince?.seconds}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlipCardTimer;