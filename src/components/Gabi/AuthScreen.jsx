import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AuthScreen = ({ setIsAuthorized }) => {
  const [password, setPassword] = useState('');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const correctPassword = 'tiktok';
  
  // Check password on each character input
  useEffect(() => {
    // Auto-submit when password matches
    if (password.toLowerCase() === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem('gabiLastVisit', new Date().getTime().toString());
    }
  }, [password, setIsAuthorized]);
  
  // Open envelope on click
  const handleEnvelopeClick = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      // Focus on input after envelope opens
      setTimeout(() => {
        const input = document.querySelector('.password-input');
        if (input) input.focus();
      }, 600);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="auth-container">
      <div className="stars-background">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className={`envelope ${isEnvelopeOpen ? 'open' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleEnvelopeClick}
      >
        <div className="envelope-front">
          <div className="heart-seal">❤️</div>
        </div>
        <div className="envelope-flap" />
        <div className="envelope-back" />
        
        <motion.div 
          className="letter"
          initial={{ y: 0 }}
          animate={{ 
            y: isEnvelopeOpen ? -60 : 0,
            transition: { duration: 0.5, ease: "easeOut" }
          }}
        >
          <div className="letter-content">
            {isEnvelopeOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="password-area"
              >
                <input
                  type="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="password-input"
                  autoComplete="off"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {!isEnvelopeOpen && (
        <motion.p 
          className="tap-instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Tap to open
        </motion.p>
      )}

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(to bottom, #121220, #1d1d30);
          font-family: 'Avant Garde Book BT', sans-serif;
          color: #fff;
          overflow: hidden;
          position: relative;
        }
        
        .stars-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: white;
          border-radius: 50%;
          opacity: 0.5;
          animation: twinkle 5s infinite ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        
        .envelope {
          position: relative;
          width: 280px;
          height: 180px;
          background-color: #f0f0f0;
          border-radius: 4px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          z-index: 1;
          transition: transform 0.3s ease;
        }
        
        .envelope:hover {
          transform: scale(1.02);
        }
        
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 140px solid transparent;
          border-right: 140px solid transparent;
          border-top: 90px solid #e6e6e6;
          border-radius: 3px;
          transform-origin: top;
          transition: transform 0.4s ease;
          z-index: 3;
        }
        
        .envelope.open .envelope-flap {
          transform: rotateX(180deg);
          z-index: 0;
        }
        
        .envelope-front {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        
        .heart-seal {
          font-size: 32px;
          transition: opacity 0.3s ease;
        }
        
        .envelope.open .heart-seal {
          opacity: 0;
        }
        
        .envelope-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #e6e6e6;
          border-radius: 4px;
          z-index: 0;
        }
        
        .letter {
          position: absolute;
          top: 10px;
          left: 10px;
          width: calc(100% - 20px);
          height: calc(100% - 20px);
          background: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 2;
          padding: 15px;
          border-radius: 3px;
          transition: transform 0.5s ease;
        }
        
        .letter-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .password-area {
          width: 100%;
          text-align: center;
        }
        
        .password-input {
          width: 90%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 16px;
          text-align: center;
          outline: none;
          transition: border-color 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .password-input:focus {
          border-color: #ff4b75;
          box-shadow: 0 0 0 2px rgba(255, 75, 117, 0.2);
        }
        
        .tap-instruction {
          margin-top: 20px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;