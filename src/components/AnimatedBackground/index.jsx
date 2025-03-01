import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size to match window
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    
    // Draw flowing curves similar to the reference
    function drawBackground() {
      // Clear canvas with base color
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = performance.now() * 0.0001; // Slower movement
      
      ctx.save();
      
      // Draw a few large flowing curves in white/light gray
      for (let i = 0; i < 3; i++) {
        const yOffset = canvas.height * 0.3 * (i + 1);
        const amplitude = 80 + i * 20;
        
        ctx.beginPath();
        ctx.moveTo(0, yOffset + Math.sin(time) * amplitude);
        
        // Use quadratic curves for better performance
        for (let x = 0; x <= canvas.width; x += canvas.width / 4) {
          const y = yOffset + Math.sin(time + x * 0.001) * amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.lineWidth = 120 + i * 40;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - i * 0.02})`; // Very subtle curves
        ctx.stroke();
      }
      
      // Draw some darker curves for contrast
      for (let i = 0; i < 2; i++) {
        const yOffset = canvas.height * 0.4 * (i + 1);
        const amplitude = 60 + i * 20;
        
        ctx.beginPath();
        ctx.moveTo(0, yOffset + Math.cos(time) * amplitude);
        
        for (let x = 0; x <= canvas.width; x += canvas.width / 4) {
          const y = yOffset + Math.cos(time + x * 0.002) * amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.lineWidth = 100 + i * 30;
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.05 - i * 0.01})`; // Very subtle dark curves
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    function animate() {
      drawBackground();
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={styles.animatedBackground}
      aria-hidden="true"
    />
  );
};

export default AnimatedBackground;