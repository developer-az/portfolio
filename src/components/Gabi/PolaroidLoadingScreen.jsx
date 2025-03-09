import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Caption options in order
const memoryCaptions = [
  "Coming into your life..",
  "I hope we...",
  "Continue to make...",
  "Happy memories."
];

const PolaroidLoadingScreen = ({ memories, onComplete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [developmentStage, setDevelopmentStage] = useState(0); 
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [captionCount, setCaptionCount] = useState(0);
  
  // Use default fallback memories if none provided
  const actualMemories = memories && memories.length > 0 ? memories : [
    {
      id: 1,
      title: "Fallback Memory",
      date: "January 2025",
      image: "/memories/image1.jpg",
      description: "Fallback memory - if you see this, no memories were passed!"
    }
  ];
  
  // Limit to first 3 images
  const limitedMemories = actualMemories.slice(0, 3);
  
  useEffect(() => {
    let developmentInterval;
    let transitionTimeout;
    
    // Simulate development process
    developmentInterval = setInterval(() => {
      setDevelopmentStage(prev => {
        if (prev >= 100) {
          clearInterval(developmentInterval);
          
          // When development completes, schedule the transition
          transitionTimeout = setTimeout(() => {
            // Increment caption count
            setCaptionCount(prev => {
              const newCount = prev + 1;
              
              // Check if we've shown all 4 captions
              if (newCount >= memoryCaptions.length) {
                // We're done showing all captions, trigger completion
                if (onComplete) {
                  setTimeout(() => onComplete(), 1000);
                }
                return newCount;
              }
              
              // Update caption index and image index
              setCurrentCaptionIndex(newCount % memoryCaptions.length);
              setCurrentImageIndex(newCount % limitedMemories.length);
              
              // Reset development stage for next image
              setDevelopmentStage(0);
              
              return newCount;
            });
          }, 2000); // Wait 2 seconds after development completes
          
          return 100;
        }
        return prev + 10; // Slower development for better visibility
      });
    }, 100);
    
    return () => {
      clearInterval(developmentInterval);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [limitedMemories.length, onComplete]);
  
  return (
    <div style={{
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
    }}>
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
          style={{
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
            transform: 'rotateX(5deg)'
          }}
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
            {limitedMemories.map((memory, index) => {
              return (
                <div 
                  key={index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: index === currentImageIndex ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={memory.image}
                      alt={memory.title || `Memory ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: `brightness(${0.7 + (developmentStage / 333)})`,
                        transition: 'filter 0.3s ease'
                      }}
                      onError={(e) => {
                        console.error(`Error loading image: ${memory.image}`);
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'%3E%3Crect width='280' height='280' fill='%23333'/%3E%3Ctext x='140' y='140' font-family='Arial' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    
                    {/* Development cover that gradually disappears */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(to bottom, 
                        rgba(30, 30, 30, ${1 - developmentStage/100}) 0%, 
                        rgba(20, 20, 20, ${1 - developmentStage/100}) 50%, 
                        rgba(10, 10, 10, ${1 - developmentStage/100}) 100%)`,
                      transition: 'background 0.2s ease'
                    }} />
                  </div>
                </div>
              );
            })}
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
      </motion.div>
    </div>
  );
};

export default PolaroidLoadingScreen;