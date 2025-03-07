import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PolaroidLoadingScreen = ({ memories }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [developmentStage, setDevelopmentStage] = useState(0); // 0-100% development
  
  useEffect(() => {
    // Simulate Polaroid development process
    const developmentInterval = setInterval(() => {
      setDevelopmentStage(prev => {
        if (prev >= 100) {
          clearInterval(developmentInterval);
          return 100;
        }
        return prev + 2; // Slowly develop
      });
    }, 100);
    
    // Switch images after development
    const imageInterval = setInterval(() => {
      if (developmentStage >= 100) {
        setCurrentImageIndex(prev => (prev + 1) % memories.length);
        setDevelopmentStage(0); // Reset development for next image
      }
    }, 6000);
    
    return () => {
      clearInterval(developmentInterval);
      clearInterval(imageInterval);
    };
  }, [developmentStage, memories.length]);
  
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
          {memories.map((memory, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Image with development mask */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
              }}>
                <img
                  src={memory.image}
                  alt={`Memory ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: `brightness(${0.5 + (developmentStage / 200)}) contrast(${0.7 + (developmentStage / 333)})`,
                    transition: 'filter 0.5s ease'
                  }}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'%3E%3Crect width='280' height='280' fill='%23333'/%3E%3Ctext x='140' y='140' font-family='Arial' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'%3EMemory%3C/text%3E%3C/svg%3E";
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
                  transition: 'background 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Polaroid bottom section with subtle label */}
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
          Developing our memories...
        </div>
      </motion.div>
      
      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          padding: '10px 20px',
          borderRadius: '20px',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <p style={{
          fontSize: '16px',
          color: '#fff',
          fontWeight: '300',
          margin: 0
        }}>
          Cherishing our moments together...
        </p>
      </motion.div>
    </div>
  );
};

export default PolaroidLoadingScreen;