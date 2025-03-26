import React, { useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryViewer from './MemoryViewer';
import styles from './MemoryIsland.module.scss';
import FlipCardTimer from './FlipCardTimer';

// Memoized background component
const Background = memo(() => (
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
));

// Memoized star component with reduced animation complexity
const Star = memo(({ top, left, size }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      top,
      left,
      filter: 'blur(0.5px)',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
      opacity: 0.3
    }}
    animate={{
      opacity: [0.3, 0.4, 0.3]
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
));

// Memoized memory box component
const MemoryBox = memo(({ box, onMemoryBoxClick, onTapHereClick }) => (
  <motion.div
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
      y: [0, -8, 0]
    }}
    transition={{
      scale: { delay: box.id * 0.2, duration: 0.5 },
      opacity: { delay: box.id * 0.2, duration: 0.5 },
      y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
    }}
    whileHover={{
      scale: 1.2,
      transition: { duration: 0.3 }
    }}
    onClick={(e) => onMemoryBoxClick(box, e)}
  >
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
        scale: 1.1
      }}
      onClick={(e) => onTapHereClick(box, e)}
    >
      TAP HERE
    </motion.div>
    
    <motion.div 
      className={styles.rose}
      whileHover={{
        scale: 1.2,
        rotateY: 180
      }}
    >
      🌹
      <div className={styles.roseGlow}></div>
    </motion.div>
  </motion.div>
));

// Memoized player component
const Player = memo(({ position }) => (
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
));

// Instructions component
const Instructions = memo(() => (
  <motion.div
    className={styles.instructionsContainer}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    style={{ 
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      textAlign: 'center',
      padding: '30px 20px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
      pointerEvents: 'none'
    }}
  >
    <motion.p 
      className={styles.instructions}
      style={{
        color: '#ffffff',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        fontWeight: '500',
        fontSize: '14px',
        letterSpacing: '0.5px',
        margin: '0 auto',
        opacity: 0.8
      }}
    >
      Click anywhere to move Gabi |||||| Click on roses 🌹 to see memories.
    </motion.p>
  </motion.div>
));

const MemoryIsland = ({ memoryBoxes, timeSince }) => {
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const [activeMemory, setActiveMemory] = useState(null);
  const canvasRef = useRef(null);
  
  // Memoize star positions and sizes
  const stars = useMemo(() => 
    [...Array(50)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`
    })), []
  );

  const handleCanvasClick = (e) => {
    if (activeMemory) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const clickedMemory = memoryBoxes.find(box => 
      Math.abs(box.x - x) < 5 && Math.abs(box.y - y) < 5
    );
    
    if (clickedMemory) {
      setPosition({ x: clickedMemory.x, y: clickedMemory.y });
      setTimeout(() => setActiveMemory(clickedMemory), 500);
    } else {
      setPosition({ x, y });
    }
  };

  const handleMemoryBoxClick = (memory, e) => {
    e.stopPropagation();
    setPosition({ x: memory.x, y: memory.y });
    setTimeout(() => setActiveMemory(memory), 500);
  };

  const handleTapHereClick = (memory, e) => {
    e.stopPropagation();
    handleMemoryBoxClick(memory, e);
  };

  const closeMemory = () => setActiveMemory(null);

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
      <Background />
      
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
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
            padding: 0
          }}
          whileHover={{ 
            opacity: 1,
            scale: 1.1
          }}
        />

        <FlipCardTimer timeSince={timeSince} />
        
        <div 
          ref={canvasRef}
          className={styles.canvas}
          onClick={handleCanvasClick}
          style={{ 
            flex: 1,
            position: 'relative',
            width: '100%',
            minHeight: 0
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}>
            {memoryBoxes.map((box) => (
              <MemoryBox
                key={box.id}
                box={box}
                onMemoryBoxClick={handleMemoryBoxClick}
                onTapHereClick={handleTapHereClick}
              />
            ))}

            <Player position={position} />
          </div>
        </div>
        
        <AnimatePresence>
          {activeMemory && (
            <MemoryViewer 
              memory={activeMemory} 
              onClose={closeMemory} 
              onNext={nextMemory} 
            />
          )}
        </AnimatePresence>

        <Instructions />
      </div>
    </div>
  );
};

export default memo(MemoryIsland);