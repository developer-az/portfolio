import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MemoryViewer = ({ memory, onClose, onNext }) => {
  // Floating effect state
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        perspective: '1500px'
      }}
      onClick={onClose} // Close on background click
    >
      <motion.div 
        initial={{ rotateY: -15, scale: 0.8, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        exit={{ rotateY: 15, scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the memory card
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.05) inset',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'rotateX(3deg)' : 'rotateX(0deg)'
        }}
        whileHover={{
          rotateX: 3,
          rotateY: [-2, 2],
          transition: {
            rotateY: {
              repeat: Infinity,
              duration: 3,
              repeatType: 'mirror'
            }
          }
        }}
      >
        {/* Close button with 3D effect */}
        <motion.button 
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '30px',
            height: '30px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            color: '#555',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateZ(40px)'
          }}
        >
          ✕
        </motion.button>
        
        {/* Polaroid-style content container */}
        <div style={{
          padding: '20px 20px 60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}>
          {/* Memory image with light frame */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              width: '100%',
              borderRadius: '3px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05) inset',
              background: '#f5f5f5',
              padding: '8px',
              marginBottom: '20px',
              transform: 'translateZ(20px)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '75%', // 4:3 aspect ratio
              overflow: 'hidden',
              borderRadius: '2px',
              boxShadow: 'inset 0 0 2px rgba(0, 0, 0, 0.1)'
            }}>
              <img 
                src={memory.image}
                alt={memory.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'translateZ(10px)'
                }}
                onError={(e) => {
                  e.target.src = "/memories/placeholder.jpg";
                }}
              />
            </div>
          </motion.div>
          
          {/* Memory details with subtle 3D effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              width: '100%',
              color: '#333',
              fontSize: '15px',
              transform: 'translateZ(30px)',
              transformStyle: 'preserve-3d'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                borderBottom: '1px solid #eee',
                paddingBottom: '10px',
                marginBottom: '10px',
                transformStyle: 'preserve-3d'
              }}
            >
              <h2 style={{
                margin: '0 0 5px 0',
                fontSize: '22px',
                fontWeight: '500',
                color: '#333',
                transform: 'translateZ(10px)'
              }}>
                {memory.title}
              </h2>
              
              <p style={{
                margin: '0',
                fontSize: '13px',
                color: '#888',
                fontStyle: 'italic',
                fontWeight: '300',
                transform: 'translateZ(5px)'
              }}>
                {memory.date}
              </p>
            </motion.div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{
                margin: '0 0 20px 0',
                lineHeight: 1.6,
                color: '#555',
                fontSize: '15px',
                fontWeight: '300',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                transform: 'translateZ(15px)'
              }}
            >
              {memory.description}
            </motion.p>
          </motion.div>
          
          {/* Navigation button with 3D effect */}
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 24px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '15px',
              fontWeight: '400',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              transform: 'translateZ(35px)'
            }}
          >
            Next Memory
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginLeft: '5px' }}
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.button>
        </div>
        
        {/* Decorative elements to enhance 3D look */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.03))',
          transform: 'translateZ(5px)'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent)',
          transform: 'translateZ(5px)'
        }} />
      </motion.div>
    </motion.div>
  );
};

export default MemoryViewer;