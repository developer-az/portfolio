import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Magnetic component creates a magnetic effect where elements are attracted to the cursor
const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate center position
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance between cursor and center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Set position with a dampening factor
    setPosition({ 
      x: distanceX * 0.2, 
      y: distanceY * 0.2 
    });
  };
  
  const handleMouseLeave = () => {
    // Reset position when mouse leaves
    setPosition({ x: 0, y: 0 });
  };
  
  // Reset position when component unmounts or window resizes
  useEffect(() => {
    const handleResize = () => {
      setPosition({ x: 0, y: 0 });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;