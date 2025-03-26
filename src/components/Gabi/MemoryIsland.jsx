import React, { useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryViewer from './MemoryViewer';
import styles from './MemoryIsland.module.scss';
import FlipCardTimer from './FlipCardTimer';

const WindEffect = memo(() => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
        transform: 'translateX(-100%)',
        willChange: 'transform',
        opacity: 0.5
      }}
      animate={{
        x: ['-100%', '200%']
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
});

const Particle = memo(({ index }) => {
  const randomValues = useMemo(() => ({
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.1 + 0.05
  }), []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `${randomValues.size}px`,
        height: `${randomValues.size}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        left: `${randomValues.x}%`,
        top: `${randomValues.y}%`,
        filter: 'blur(1px)',
        willChange: 'transform, opacity',
        opacity: randomValues.opacity
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [randomValues.opacity, randomValues.opacity * 1.5, randomValues.opacity]
      }}
      transition={{
        duration: randomValues.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: randomValues.delay
      }}
    />
  );
});

const LightBeam = memo(({ index }) => {
  const randomValues = useMemo(() => ({
    angle: Math.random() * 360,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.05 + 0.02
  }), []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '2px',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent)',
        left: `${(index / 7) * 100}%`,
        transform: `rotate(${randomValues.angle}deg)`,
        transformOrigin: 'top',
        willChange: 'transform, opacity',
        opacity: randomValues.opacity
      }}
      animate={{
        opacity: [randomValues.opacity, randomValues.opacity * 1.5, randomValues.opacity],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: randomValues.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: randomValues.delay
      }}
    />
  );
});

const MemoryIsland = ({ memoryBoxes, timeSince }) => {
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const [activeMemory, setActiveMemory] = useState(null);
  const canvasRef = useRef(null);
  
  // Handle canvas click for movement
  const handleCanvasClick = (e) => {
    if (activeMemory) return; // Don't move when viewing a memory
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Check if clicked near a memory box
    const clickedMemory = memoryBoxes.find(box => {
      return Math.abs(box.x - x) < 5 && Math.abs(box.y - y) < 5;
    });
    
    if (clickedMemory) {
      // First move to the memory location
      setPosition({ x: clickedMemory.x, y: clickedMemory.y });
      
      // Then open the memory after a short delay
      setTimeout(() => {
        setActiveMemory(clickedMemory);
      }, 500);
    } else {
      // Just move to the clicked position
      setPosition({ x, y });
    }
  };

  // Handle memory box click (for direct clicking on roses)
  const handleMemoryBoxClick = (memory, e) => {
    e.stopPropagation(); // Prevent triggering canvas click
    setPosition({ x: memory.x, y: memory.y });
    
    // Open memory after a short delay
    setTimeout(() => {
      setActiveMemory(memory);
    }, 500);
  };

  // Handle clicks on "TAP HERE" text too
  const handleTapHereClick = (memory, e) => {
    e.stopPropagation(); // Prevent triggering canvas click
    handleMemoryBoxClick(memory, e);
  };

  // Close memory view
  const closeMemory = () => {
    setActiveMemory(null);
  };

  // Navigate to next memory
  const nextMemory = () => {
    const currentIndex = memoryBoxes.findIndex(m => m.id === activeMemory.id);
    const nextIndex = (currentIndex + 1) % memoryBoxes.length;
    setActiveMemory(memoryBoxes[nextIndex]);
    setPosition({ x: memoryBoxes[nextIndex].x, y: memoryBoxes[nextIndex].y });
  };

  const handleReset = () => {
    localStorage.removeItem('gabiLastVisit');
    localStorage.removeItem('gabiDevMode');
    window.location.href = '/gabi';
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
      perspective: '1000px'
    }}>
      {/* Space background effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.08), transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08), transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.05), transparent 60%)
        `,
        filter: 'blur(50px)',
        opacity: 0.3,
        zIndex: 1
      }} />
      
      {/* Stars */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            willChange: 'transform, opacity'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Content container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Reset Button */}
        <motion.button
          onClick={handleReset}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '30px',
            height: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 1000,
            opacity: 0.3,
            transition: 'all 0.3s ease',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          whileHover={{ 
            opacity: 1,
            scale: 1.1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)'
          }}
          whileTap={{ scale: 0.95 }}
        />

        {/* "Time Since We First Met" Flipcard Timer */}
        <FlipCardTimer timeSince={timeSince} />
        
        <div 
          ref={canvasRef}
          className={styles.canvas}
          onClick={handleCanvasClick}
          style={{ height: '100vh', maxHeight: '100vh' }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}>
            {/* Memory boxes (roses) */}
            {memoryBoxes.map((box) => (
              <motion.div
                key={box.id}
                className={styles.memoryBox}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  cursor: 'pointer',
                  zIndex: 2
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: [0, -8, 0],
                  rotateY: [0, 8, 0, -8, 0]
                }}
                transition={{
                  scale: { delay: box.id * 0.2, duration: 0.5 },
                  opacity: { delay: box.id * 0.2, duration: 0.5 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  rotateY: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.3 }
                }}
                onClick={(e) => handleMemoryBoxClick(box, e)}
              >
                {/* "Tap Here" text - no flip on hover */}
                <motion.div 
                  className={styles.tapHere}
                  style={{
                    color: '#ffffff',
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                    fontWeight: '600',
                    fontSize: '14px',
                    letterSpacing: '1px'
                  }}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.1,
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.6)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={(e) => handleTapHereClick(box, e)}
                >
                  TAP HERE
                </motion.div>
                
                {/* Rose emoji with flip animation */}
                <motion.div 
                  className={styles.rose}
                  whileHover={{
                    scale: 1.2,
                    rotateY: 180,
                    filter: 'brightness(1.2)'
                  }}
                  transition={{ duration: 0.5 }}
                >
                  🌹
                  <div className={styles.roseGlow}></div>
                </motion.div>
              </motion.div>
            ))}

            {/* Player with "Gabi" text and white heart */}
            <motion.div
              className={styles.player}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: 2
              }}
              animate={{
                left: `${position.x}%`, 
                top: `${position.y}%` 
              }}
              transition={{
                type: "spring", 
                stiffness: 100, 
                damping: 15 
              }}
            >
              {/* "Gabi" text */}
              <motion.div
                className={styles.playerName}
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  fontWeight: '700',
                  fontSize: '18px',
                  letterSpacing: '1px'
                }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                GABI
              </motion.div>
              
              {/* White Heart */}
              <motion.div 
                className={styles.playerHeart}
                animate={{ 
                  boxShadow: [
                    '0 0 10px 2px rgba(255, 255, 255, 0.3)',
                    '0 0 15px 4px rgba(255, 255, 255, 0.5)',
                    '0 0 10px 2px rgba(255, 255, 255, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ❤️
                <div className={styles.heartGlow}></div>
              </motion.div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              className={styles.instructionsContainer}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ zIndex: 2 }}
            >
              <motion.p 
                className={styles.instructions}
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  fontWeight: '600',
                  fontSize: '16px',
                  letterSpacing: '0.5px'
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Click anywhere to move Gabi. Click on roses 🌹
              </motion.p>
            </motion.div>
          </div>
        </div>
        
        {/* Memory viewer */}
        <AnimatePresence>
          {activeMemory && (
            <MemoryViewer 
              memory={activeMemory} 
              onClose={closeMemory} 
              onNext={nextMemory} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cosmic particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
            willChange: 'transform',
            transform: 'translateZ(0)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

export default MemoryIsland;