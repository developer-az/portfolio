import React from 'react';
import { motion } from 'framer-motion';

// Simple standalone "I miss you" component
const MissYouScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: '#0f0f0f',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          textShadow: [
            '0 0 10px rgba(255, 255, 255, 0.3)',
            '0 0 20px rgba(255, 255, 255, 0.08)',
            '0 0 10px rgba(255, 255, 255, 0.1)'
          ]
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 1,
          ease: "easeInOut"
        }}
        style={{
          color: 'rgba(255, 255, 255, 0.06)', // More visible
          fontSize: '48px',
          fontWeight: '300',
          letterSpacing: '2px',
          textAlign: 'center',
          fontFamily: 'Avant Garde Book BT, sans-serif',
        }}
      >
        I miss you
      </motion.p>
    </div>
  );
};

export default MissYouScreen;