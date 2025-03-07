import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AuthScreen = ({ setIsAuthorized }) => {
  const [password, setPassword] = useState('');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const inputRef = useRef(null);
  const correctPassword = 'tiktok';
  
  // Check password on each character input
  useEffect(() => {
    // Auto-submit when password matches
    if (password.toLowerCase() === correctPassword) {
      // Short delay to show successful typing before transitioning
      setTimeout(() => {
        setIsAuthorized(true);
        localStorage.setItem('gabiLastVisit', new Date().getTime().toString());
      }, 300);
    }
  }, [password, setIsAuthorized]);
  
  // Open envelope on click/tap
  const handleEnvelopeClick = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      // Focus on input after envelope opens with delay to ensure animation completes
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 800);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="auth-screen">
      <div className="stars">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="content-container">
        <motion.div 
          className={`envelope ${isEnvelopeOpen ? 'open' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleEnvelopeClick}
        >
          <div className="envelope-back"></div>
          <div className="envelope-flap"></div>
          <div className="envelope-front">
            <div className="heart-seal">❤️</div>
          </div>
          
          <motion.div 
            className="letter"
            animate={{ 
              y: isEnvelopeOpen ? -70 : 0,
            }}
            transition={{ 
              duration: 0.7, 
              ease: "easeOut",
              delay: isEnvelopeOpen ? 0.2 : 0
            }}
          >
            <div className="letter-content">
              {isEnvelopeOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="password-container"
                >
                  <input
                    ref={inputRef}
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
      </div>

      <style jsx>{`
        .auth-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom, #121220, #1d1d30);
          font-family: sans-serif;
          color: #fff;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        
        .content-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 20px;
          z-index: 2;
          touch-action: manipulation;
        }
        
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          opacity: 0.6;
          animation: twinkle infinite ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        
        .envelope {
          position: relative;
          width: 280px;
          max-width: 90vw;
          height: 180px;
          max-height: 30vh;
          background-color: #f0f0f0;
          border-radius: 4px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          margin-bottom: 20px;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .envelope-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #e6e6e6;
          border-radius: 4px;
          z-index: 1;
        }
        
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: calc(280px / 2) solid transparent;
          border-right: calc(280px / 2) solid transparent;
          border-top: 90px solid #e0e0e0;
          border-radius: 4px;
          transform-origin: top;
          transition: transform 0.6s ease;
          z-index: 3;
        }
        
        @media (max-width: 300px) {
          .envelope-flap {
            border-left-width: 45vw;
            border-right-width: 45vw;
            border-top-width: 60px;
          }
        }
        
        .envelope.open .envelope-flap {
          transform: rotateX(180deg);
          z-index: 1;
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
          z-index: 2;
        }
        
        .heart-seal {
          font-size: 32px;
          transition: opacity 0.3s ease;
          user-select: none;
          -webkit-user-select: none;
        }
        
        .envelope.open .heart-seal {
          opacity: 0;
        }
        
        .letter {
          position: absolute;
          top: 10px;
          left: 10px;
          width: calc(100% - 20px);
          height: calc(100% - 20px);
          background: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 4;
          padding: 15px;
          border-radius: 3px;
        }
        
        .letter-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .password-container {
          width: 100%;
          text-align: center;
        }
        
        .password-input {
          width: 90%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 16px;
          text-align: center;
          outline: none;
          transition: border-color 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          -webkit-appearance: none;
          appearance: none;
        }
        
        .password-input:focus {
          border-color: #ff4b75;
          box-shadow: 0 0 0 2px rgba(255, 75, 117, 0.2);
        }
        
        .tap-instruction {
          margin-top: 15px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;