'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized constants
const memoryCaptions = [
  "Coming into your life..",
  "I hope we...",
  "Continue to make...",
  "Happy memories."
];

// Finite state machine states
const STATES = {
  DEVELOPING: "developing",
  DISPLAY: "display",
  TRANSITION: "transition"
};

// Memoized image component
const MemoryImage = memo(({ memory, developmentStage, index, isActive }) => {
  const imageStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: `brightness(${0.7 + (developmentStage / 333)})`,
    transition: 'filter 0.3s ease',
    willChange: 'filter'
  }), [developmentStage]);

  const containerStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: isActive ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    willChange: 'opacity'
  }), [isActive]);

  const developmentCoverStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(to bottom, 
      rgba(30, 30, 30, ${1 - developmentStage/100}) 0%, 
      rgba(20, 20, 20, ${1 - developmentStage/100}) 50%, 
      rgba(10, 10, 10, ${1 - developmentStage/100}) 100%)`,
    transition: 'background 0.2s ease',
    willChange: 'background'
  }), [developmentStage]);

  return (
    <div style={containerStyle}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <img
          src={memory.image}
          alt={memory.title || `Memory ${index + 1}`}
          style={imageStyle}
          loading="eager"
          onError={(e) => {
            console.error(`Error loading image: ${memory.image}`);
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'%3E%3Crect width='280' height='280' fill='%23333'/%3E%3Ctext x='140' y='140' font-family='Arial' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
          }}
        />
        <div style={developmentCoverStyle} />
      </div>
    </div>
  );
});

// Memoized progress indicator component
const ProgressIndicator = memo(({ total, current, completed }) => {
  const indicators = useMemo(() => 
    [...Array(total)].map((_, i) => ({
      key: i,
      isCompleted: i < completed,
      isCurrent: i === current,
      style: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: i < completed ? 
          'rgba(255, 255, 255, 0.8)' : 
          i === current ? 
            'rgba(255, 255, 255, 0.5)' :
            'rgba(255, 255, 255, 0.2)',
        transition: 'background-color 0.3s ease',
        willChange: 'background-color'
      }
    })), [total, current, completed]);

  return (
    <div style={{ 
      display: 'flex', 
      marginTop: '15px', 
      gap: '8px' 
    }}>
      {indicators.map(({ key, style }) => (
        <div key={key} style={style} />
      ))}
    </div>
  );
});

const PolaroidLoadingScreen = ({ memories, onComplete }) => {
  // Core state management
  const [currentState, setCurrentState] = useState(STATES.DEVELOPING);
  const [developmentStage, setDevelopmentStage] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [totalCaptionsShown, setTotalCaptionsShown] = useState(0);
  const [sequenceCompleted, setSequenceCompleted] = useState(false);
  
  // Refs for managing cleanup
  const timeoutRef = useRef(null);
  
  // Use default fallback memories if none provided
  const actualMemories = memories && memories.length > 0 ? memories : [{
    id: 1,
    title: "Fallback Memory",
    date: "January 2025",
    image: "/memories/image1.jpg",
    description: "Fallback memory - if you see this, no memories were passed!"
  }];
  
  // Limit to first 3 images
  const limitedMemories = actualMemories.slice(0, 3);

  // Development phase handler
  useEffect(() => {
    if (currentState !== STATES.DEVELOPING || sequenceCompleted) return;
    
    // Gradual development of the image
    if (developmentStage < 100) {
      timeoutRef.current = setTimeout(() => {
        setDevelopmentStage(prev => Math.min(prev + 5, 100));
      }, 80); // Slightly faster development for better user experience
    } 
    // Once development reaches 100%, move to display state
    else {
      setCurrentState(STATES.DISPLAY);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentState, developmentStage, sequenceCompleted]);

  // Display phase handler
  useEffect(() => {
    if (currentState !== STATES.DISPLAY || sequenceCompleted) return;
    
    // Show the fully developed image for 2 seconds
    timeoutRef.current = setTimeout(() => {
      setCurrentState(STATES.TRANSITION);
    }, 2000);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentState, sequenceCompleted]);

  // Transition phase handler
  useEffect(() => {
    if (currentState !== STATES.TRANSITION || sequenceCompleted) return;
    
    // First update total captions shown
    const newTotalShown = totalCaptionsShown + 1;
    setTotalCaptionsShown(newTotalShown);
    
    // Check if we've shown all captions
    if (newTotalShown >= memoryCaptions.length) {
      setSequenceCompleted(true);
      
      // Call onComplete after a small delay
      timeoutRef.current = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1000);
      return;
    }
    
    // Otherwise, prepare for the next caption/image
    setCurrentCaptionIndex(prev => (prev + 1) % memoryCaptions.length);
    setCurrentImageIndex(prev => (prev + 1) % limitedMemories.length);
    setDevelopmentStage(0);
    setCurrentState(STATES.DEVELOPING);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentState, totalCaptionsShown, limitedMemories.length, onComplete, sequenceCompleted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized styles
  const containerStyle = useMemo(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: '#0f0f0f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    perspective: '1200px'
  }), []);

  const polaroidStyle = useMemo(() => ({
    position: 'relative',
    width: '320px',
    height: '380px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05) inset',
    padding: '16px 16px 50px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(5deg)',
    willChange: 'transform'
  }), []);

  return (
    <div style={containerStyle}>
      <motion.div
        key="polaroid-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        {/* Polaroid Frame */}
        <motion.div 
          initial={{ rotateY: -15, rotateX: 10 }}
          animate={{ 
            rotateY: [-15, 5, -5, 0], 
            rotateX: [10, -5, 2, 0] 
          }}
          transition={{ 
            duration: 3, 
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 1]
          }}
          style={polaroidStyle}
        >
          {/* Photo area with development effect */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#111',
            overflow: 'hidden',
            transformStyle: 'preserve-3d'
          }}>
            {limitedMemories.map((memory, index) => (
              <MemoryImage
                key={index}
                memory={memory}
                developmentStage={developmentStage}
                index={index}
                isActive={index === currentImageIndex}
              />
            ))}
          </div>
          
          {/* Polaroid bottom section with date */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            width: '80%',
            textAlign: 'center',
            fontFamily: 'Courier New, monospace',
            color: '#aaa',
            fontSize: '12px',
            fontWeight: '300',
            letterSpacing: '1px',
            transform: 'translateZ(5px)'
          }}>
            {limitedMemories[currentImageIndex]?.date || "January 2025"}
          </div>
        </motion.div>
        
        {/* Caption with changing text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            padding: '10px 20px',
            borderRadius: '20px',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '280px',
            minHeight: '24px'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentCaptionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: '16px',
                color: '#fff',
                fontWeight: '300',
                margin: 0,
                textAlign: 'center'
              }}
            >
              {memoryCaptions[currentCaptionIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Development progress indicator */}
        <motion.div 
          style={{
            marginTop: '20px',
            width: '200px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <motion.div
            style={{
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              width: `${developmentStage}%`,
              transition: 'width 0.1s linear',
              willChange: 'width'
            }}
          />
        </motion.div>
        
        {/* Progress indicators */}
        <ProgressIndicator
          total={memoryCaptions.length}
          current={currentCaptionIndex}
          completed={totalCaptionsShown}
        />
      </motion.div>
    </div>
  );
};

export default memo(PolaroidLoadingScreen);