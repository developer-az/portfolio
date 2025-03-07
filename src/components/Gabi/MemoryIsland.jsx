import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryViewer from './MemoryViewer';
import styles from './MemoryIsland.module.scss';
import FlipCardTimer from './FlipCardTimer';

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
  
  return (
    <div className={styles.memoryIsland}>
      {/* "Time Since We First Met" Flipcard Timer */}
      <FlipCardTimer timeSince={timeSince} />
      
      <div 
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleCanvasClick}
        style={{ height: '100vh', maxHeight: '100vh' }} // Ensure it fits in viewport
      >
        {/* Improved calm background */}
        <div className={styles.background}>
          <div className={styles.gradientOverlay1}></div>
          <div className={styles.gradientOverlay2}></div>
          
          {/* Generate subtle stars */}
          {[...Array(35)].map((_, i) => {
            const size = Math.random() * 1.5 + 0.5;
            const opacity = Math.random() * 0.4 + 0.1;
            const depth = Math.random() * 80 + 40;
            const duration = Math.random() * 8 + 12;
            const delay = Math.random() * 10;
            
            return (
              <div 
                key={i} 
                className={styles.star}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: opacity,
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.3)`,
                  animation: `gentlePulse ${duration}s infinite ease-in-out ${delay}s`,
                  transform: `translateZ(-${depth}px)`
                }}
              />
            );
          })}
          
          <div className={styles.lightMist}></div>
          
          {/* Grid lines */}
          <svg className={styles.grid}>
            {/* Horizontal grid lines */}
            {[...Array(6)].map((_, i) => (
              <line 
                key={`h-${i}`}
                x1="0" 
                y1={`${(i+1) * 16.6}%`} 
                x2="100%" 
                y2={`${(i+1) * 16.6}%`} 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="1"
              />
            ))}
            
            {/* Vertical grid lines */}
            {[...Array(6)].map((_, i) => (
              <line 
                key={`v-${i}`}
                x1={`${(i+1) * 16.6}%`} 
                y1="0" 
                x2={`${(i+1) * 16.6}%`} 
                y2="100%" 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="1"
              />
            ))}
          </svg>
          
          {/* Memory boxes (roses) */}
          {memoryBoxes.map((box) => (
            <motion.div 
              key={box.id}
              className={styles.memoryBox}
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                cursor: 'pointer' // Make cursor a pointer to indicate clickability
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -5, 0],
                rotateY: [0, 5, 0, -5, 0]
              }}
              transition={{
                scale: { delay: box.id * 0.2, duration: 0.5 },
                opacity: { delay: box.id * 0.2, duration: 0.5 },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                rotateY: { repeat: Infinity, duration: 7, ease: "easeInOut" }
              }}
              onClick={(e) => handleMemoryBoxClick(box, e)} // Handle click directly on the memory box
            >
              {/* "Tap Here" text */}
              <motion.div 
                className={styles.tapHere}
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={(e) => handleTapHereClick(box, e)} // Also handle click on "Tap Here" text
              >
                TAP HERE
              </motion.div>
              
              {/* Rose emoji */}
              <motion.div 
                className={styles.rose}
                whileHover={{ scale: 1.2, rotateY: 180 }}
                transition={{ duration: 0.8 }}
              >
                🌹
                <div className={styles.roseGlow}></div>
              </motion.div>
            </motion.div>
          ))}
          
          {/* Player dot with "Gabi" text */}
          <motion.div 
            className={styles.player}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
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
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              GABI
            </motion.div>
            
            {/* The dot */}
            <motion.div 
              className={styles.playerDot}
              animate={{ 
                boxShadow: [
                  '0 0 10px 2px rgba(255, 255, 255, 0.3)',
                  '0 0 15px 4px rgba(255, 255, 255, 0.5)',
                  '0 0 10px 2px rgba(255, 255, 255, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className={styles.playerGlow}></div>
            </motion.div>
          </motion.div>
          
          {/* Instructions */}
          <motion.div 
            className={styles.instructionsContainer}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.p 
              className={styles.instructions}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Click anywhere to move Gabi. Click on roses 🌹 to discover our memories.
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
  );
};

export default MemoryIsland;