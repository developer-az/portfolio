import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized star component with stable random values
const Star = memo(({ id }) => {
  const randomValues = useMemo(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }), []); // Empty dependency array since we want these values to be stable

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `${randomValues.size}px`,
        height: `${randomValues.size}px`,
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        top: randomValues.top,
        left: randomValues.left,
        filter: 'blur(0.5px)',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
        willChange: 'transform, opacity'
      }}
      animate={{
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.5, 1]
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

// Memoized nebula component
const Nebula = memo(() => {
  return (
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
  );
});

const AuthScreen = ({ setIsAuthorized }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Memoized handlers
  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value.toLowerCase() === 'tiktok' || value.toLowerCase() === 'tik tok') {
      setIsAuthenticating(true);
      setTimeout(() => {
        setIsAuthorized(true);
        localStorage.setItem('gabiLastVisit', new Date().getTime().toString());
      }, 1000);
    }
  }, [setIsAuthorized]);

  // Memoize star IDs to prevent re-rendering
  const starIds = useMemo(() => Array.from({ length: 100 }, (_, i) => i), []);

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
      <Nebula />
      
      {/* Stars with stable IDs */}
      {starIds.map(id => (
        <Star key={id} id={id} />
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
        {/* Title */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '10px',
              letterSpacing: '2px',
              background: 'linear-gradient(45deg, #fff, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
          </motion.h1>
          <motion.h2
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              letterSpacing: '3px',
              background: 'linear-gradient(45deg, #fff, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Anthony's Garden of Rose
          </motion.h2>
        </motion.div>

        {/* Input field */}
        <motion.div
          style={{
            position: 'relative',
            width: '300px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter magic word"
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              color: '#ffffff',
              outline: 'none',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: isFocused ? '0 0 30px rgba(255, 255, 255, 0.2)' : 'none'
            }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.2)'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          />
        </motion.div>

        {/* Success message */}
        <AnimatePresence>
          {isAuthenticating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginTop: '20px',
                color: '#4ade80',
                fontSize: '18px',
                fontWeight: '600',
                textShadow: '0 0 20px rgba(74, 222, 128, 0.5)'
              }}
            >
              Welcome back, Gabi! 🌹
            </motion.div>
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

export default memo(AuthScreen);