import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size with device pixel ratio consideration
    function setCanvasSize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }
    
    // Initial setup
    setCanvasSize();
    
    // Resize listener with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 200);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Create flowing curves
    function drawBackground() {
      const time = performance.now() * 0.0001; // Slow down animation for better performance
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      // Clear with transparent background
      ctx.clearRect(0, 0, width, height);
      
      // Draw fewer curves for better performance
      const numCurves = window.innerWidth < 768 ? 2 : 3;
      
      for (let i = 0; i < numCurves; i++) {
        // Calculate curve parameters
        const yOffset = height * 0.3 * (i + 1);
        const amplitude = 80 + i * 20;
        
        // Draw more efficiently with fewer points
        const segments = window.innerWidth < 768 ? 3 : 4;
        const segmentWidth = width / segments;
        
        ctx.beginPath();
        ctx.moveTo(0, yOffset + Math.sin(time) * amplitude);
        
        for (let x = 0; x <= width; x += segmentWidth) {
          const y = yOffset + Math.sin(time + x * 0.001) * amplitude;
          ctx.lineTo(x, y);
        }
        
        // Optimize styling
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - i * 0.02})`;
        ctx.lineWidth = 100 + i * 30;
        ctx.stroke();
      }
      
      // Draw fewer darker curves
      const darkCurves = window.innerWidth < 768 ? 1 : 2;
      
      for (let i = 0; i < darkCurves; i++) {
        const yOffset = height * 0.4 * (i + 1);
        const amplitude = 60 + i * 20;
        
        ctx.beginPath();
        ctx.moveTo(0, yOffset + Math.cos(time) * amplitude);
        
        for (let x = 0; x <= width; x += width / 3) {
          const y = yOffset + Math.cos(time + x * 0.002) * amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.04 - i * 0.01})`;
        ctx.lineWidth = 80 + i * 20;
        ctx.stroke();
      }
    }
    
    // Animation loop with framerate limiting
    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    
    function animate(currentTime) {
      animationFrameId.current = requestAnimationFrame(animate);
      
      // Skip frames to maintain target FPS
      if (currentTime - lastFrameTime < frameInterval) return;
      
      lastFrameTime = currentTime;
      drawBackground();
    }
    
    animate(0);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
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

export default React.memo(AnimatedBackground);