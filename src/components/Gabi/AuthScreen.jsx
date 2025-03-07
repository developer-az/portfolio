import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AuthScreen = ({ setIsAuthorized }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password.toLowerCase() === 'tiktok') {
      setIsAuthorized(true);
      localStorage.setItem('gabiLastVisit', new Date().getTime().toString());
    } else {
      setError('?');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: 'white',
      fontFamily: 'Avant Garde Book BT, sans-serif',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a24, #0f0f0f)',
      overflow: 'hidden',
      perspective: '1000px'
    }}>
      {/* Moving stars background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const opacity = Math.random() * 0.7 + 0.3;
          return (
            <div 
              key={i} 
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                opacity: opacity,
                boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`,
                animation: `authTwinkle ${(Math.random() * 5) + 3}s infinite ease-in-out ${Math.random() * 5}s`
              }}
            />
          );
        })}
      </div>
      
      {/* 3D Login Card */}
      <motion.div 
        initial={{ opacity: 0, rotateX: -10, y: 20 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          backgroundColor: 'rgba(25, 25, 25, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '40px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'rotateX(5deg) scale(1.02)' : 'rotateX(0) scale(1)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Title with 3D effect */}
        <motion.h2 
          animate={{ 
            y: [0, -5, 0],
            textShadow: [
              '0 0 8px rgba(255, 255, 255, 0)',
              '0 0 12px rgba(255, 255, 255, 0.3)',
              '0 0 8px rgba(255, 255, 255, 0)'
            ]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{ 
            margin: '0 0 10px 0', 
            fontWeight: '300',
            letterSpacing: '1px',
            color: 'rgba(255, 255, 255, 0.9)',
            transform: 'translateZ(30px)'
          }}
        >
          Our Secret Place
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ 
            marginBottom: '30px', 
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: '300',
            fontSize: '15px',
            transform: 'translateZ(20px)'
          }}
        >
          Enter the password to access our memories
        </motion.p>
        
        <form onSubmit={handleSubmit} style={{ transformStyle: 'preserve-3d' }}>
          {/* Password input with 3D effect */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              whileFocus={{ scale: 1.02 }}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                fontWeight: '300',
                transform: 'translateZ(25px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
          </motion.div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ 
                color: '#ff6b6b', 
                margin: '10px 0 20px 0', 
                fontSize: '14px',
                transform: 'translateZ(20px)'
              }}
            >
              {error}
            </motion.p>
          )}
          
          {/* Submit button with 3D effect */}
          <motion.button 
            type="submit" 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 30px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '300',
              transform: 'translateZ(35px)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            Enter
          </motion.button>
        </form>
        
        {/* Decorative elements to enhance 3D look */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '-15px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
          transform: 'translateZ(5px)'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05))',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.03)',
          transform: 'translateZ(5px)'
        }} />
      </motion.div>
      
      <style jsx global>{`
        @keyframes authTwinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;