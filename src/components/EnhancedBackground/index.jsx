'use client';
import React, { useEffect, useRef } from 'react';
import styles from './EnhancedBackground.module.scss';

const EnhancedBackground = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let canvas, ctx, width, height;
    let stars = [];
    
    // Create canvas element
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    containerRef.current.appendChild(canvas);
    
    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasSize();
    
    // Initialize stars
    const initStars = () => {
      const count = Math.min(width, height) / 3;
      stars = [];
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.5
        });
      }
    };
    
    initStars();
    
    // Handle mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    
    // Handle scroll
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    
    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      initStars();
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Animation frame
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars
        star.x += (mouseRef.current.x - width / 2) * 0.00005 * star.size;
        star.y += star.speed + (mouseRef.current.y - height / 2) * 0.00005 * star.size;
        
        // Reset if star is out of bounds
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }
      
      // Add subtle connections between stars
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < stars.length; i += 30) {
        const star1 = stars[i];
        
        for (let j = i + 1; j < stars.length; j += 30) {
          const star2 = stars[j];
          const distance = Math.sqrt((star1.x - star2.x) ** 2 + (star1.y - star2.y) ** 2);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (canvas && containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={styles.enhancedBackground}
      aria-hidden="true"
    />
  );
};

export default React.memo(EnhancedBackground);