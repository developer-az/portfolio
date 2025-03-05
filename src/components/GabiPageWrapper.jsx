'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GabiPageWrapper = () => {
  // Authentication state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Memory island state
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const [activeMemory, setActiveMemory] = useState(null);
  const canvasRef = useRef(null);
  
  // Timer state
  const [timeSince, setTimeSince] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Memory data
  const memoryBoxes = [
    {
      id: 1,
      x: 20,
      y: 30,
      title: "First Date",
      date: "April 15, 2023",
      image: "/memories/first-date.jpg",
      description: "We met at the coffee shop downtown. I was nervous, you were beautiful. I knew something special was beginning when you laughed at my terrible joke about the barista's mustache."
    },
    {
      id: 2,
      x: 70,
      y: 40,
      title: "Sunset Hike",
      date: "June 22, 2023",
      image: "/memories/hike.jpg",
      description: "We hiked up to Eagle Point just before sunset. The view was breathtaking, but not as breathtaking as watching the golden light illuminate your face. We talked about our dreams until the stars came out."
    },
    {
      id: 3,
      x: 30,
      y: 65,
      title: "Rainy Day",
      date: "September 5, 2023",
      image: "/memories/rainy-day.jpg",
      description: "It poured all day. We built a fort in the living room, made hot chocolate, and read to each other from our favorite books. I never knew staying in could feel like such an adventure."
    },
    {
      id: 4,
      x: 65,
      y: 75,
      title: "Beach Trip",
      date: "August 12, 2023",
      image: "/memories/beach.jpg",
      description: "Our weekend getaway to the coast. You collected seashells while I tried (and failed) to surf. We stayed up all night talking by the bonfire, wrapped in blankets, planning our future adventures."
    },
    {
      id: 5,
      x: 50,
      y: 20,
      title: "Birthday Surprise",
      date: "October 30, 2023",
      image: "/memories/birthday.jpg",
      description: "I spent weeks planning your surprise party. The look on your face when everyone jumped out was priceless. You told me later it was the most special birthday you'd ever had."
    }
  ];

  // Check for previous authentication
  useEffect(() => {
    // Skip password for development
    if (process.env.NODE_ENV === 'development') {
      setIsAuthorized(true);
      return;
    }
    
    // Get last visit from localStorage
    const lastVisit = localStorage.getItem('gabiLastVisit');
    const currentTime = new Date().getTime();
    
    // If visited within the last 24 hours, auto-authorize
    if (lastVisit && (currentTime - parseInt(lastVisit)) < 24 * 60 * 60 * 1000) {
      setIsAuthorized(true);
    }
  }, []);
  
  // State for loading screen
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Memory photos for loading screen
  const memoryPhotos = [
    "/memories/first-date.jpg",
    "/memories/hike.jpg",
    "/memories/rainy-day.jpg",
    "/memories/beach.jpg",
    "/memories/birthday.jpg"
  ];
  
  // Handle loading screen and image shuffling
  useEffect(() => {
    if (isLoading) {
      // Shuffle through images during loading
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % memoryPhotos.length);
      }, 1500);
      
      // Simulate loading time (adjust as needed)
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => {
        clearInterval(imageInterval);
        clearTimeout(loadingTimer);
      };
    }
  }, [isLoading]);
  
  // Calculate time since first meeting
  useEffect(() => {
    const firstMeetingDate = new Date('2024-09-07T23:20:00');
    
    const calculateTimeSince = () => {
      const now = new Date();
      const difference = now - firstMeetingDate;
      
      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeSince({ days, hours, minutes, seconds });
    };
    
    // Calculate initially
    calculateTimeSince();
    
    // Update the timer every second
    const interval = setInterval(calculateTimeSince, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password.toLowerCase() === 'iloveyougabi') {
      setIsAuthorized(true);
      localStorage.setItem('gabiLastVisit', new Date().getTime().toString());
    } else {
      setError('That\'s not quite right. Try again?');
    }
  };
  
  // Handle canvas click for movement
  const handleCanvasClick = (e) => {
    if (activeMemory) return; // Don't move when viewing a memory
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Check if clicked near a memory box
    const clickedMemory = memoryBoxes.find(box => {
      return Math.abs(box.x - x) < 5 && Math.abs(box.y - y) < 5;
    });
    
    if (clickedMemory) {
      // First move to the memory location
      setPosition({ x: clickedMemory.x, y: clickedMemory.y });
      
      // Then open the memory after a short delay
      setTimeout(() => {
        setActiveMemory(clickedMemory);
      }, 500);
    } else {
      // Just move to the clicked position
      setPosition({ x, y });
    }
  };

  // Close memory view
  const closeMemory = () => {
    setActiveMemory(null);
  };

  // Navigate to next memory
  const nextMemory = () => {
    const currentIndex = memoryBoxes.findIndex(m => m.id === activeMemory.id);
    const nextIndex = (currentIndex + 1) % memoryBoxes.length;
    setActiveMemory(memoryBoxes[nextIndex]);
    setPosition({ x: memoryBoxes[nextIndex].x, y: memoryBoxes[nextIndex].y });
  };
  
  // Format time unit with leading zero if needed
  const formatTimeUnit = (unit) => {
    return unit.toString().padStart(2, '0');
  };
  
  // If not authorized, show login form
  if (!isAuthorized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: 'white',
        fontFamily: 'Avant Garde Book BT, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'rgba(25, 25, 25, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '40px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontWeight: 'normal' }}>Our Secret Place</h2>
          <p style={{ marginBottom: '30px', color: 'rgba(255, 255, 255, 0.7)' }}>Enter the password to access our memories</p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            
            {error && <p style={{ color: '#ff6b6b', margin: '10px 0 20px 0', fontSize: '14px' }}>{error}</p>}
            
            <button 
              type="submit" 
              style={{
                padding: '12px 30px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // Show loading screen if still loading
  if (isLoading && isAuthorized) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          position: 'relative',
          width: '280px',
          height: '280px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: '20px'
        }}>
          {memoryPhotos.map((photo, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                backgroundImage: `url(${photo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
        </div>
        <div style={{
          padding: '10px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '20px'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#000',
            margin: 0,
            fontWeight: 'normal'
          }}>
            Loading our memories...
          </p>
        </div>
      </div>
    );
  }
  
  // Otherwise, show the memory island with white background
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#fff', // Changed to white
      fontFamily: 'Avant Garde Book BT, sans-serif'
    }}>
      {/* "Time Since We First Met" Timer */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: '#000', // Black text
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '15px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '16px', 
            fontWeight: 'normal',
            letterSpacing: '1px',
            textTransform: 'uppercase' 
          }}>
            Time Since We First Met
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px' }}>{formatTimeUnit(timeSince.days)}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Days</span>
            </div>
            <div style={{ fontSize: '24px', alignSelf: 'flex-start', opacity: 0.5 }}>:</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px' }}>{formatTimeUnit(timeSince.hours)}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Hours</span>
            </div>
            <div style={{ fontSize: '24px', alignSelf: 'flex-start', opacity: 0.5 }}>:</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px' }}>{formatTimeUnit(timeSince.minutes)}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Minutes</span>
            </div>
            <div style={{ fontSize: '24px', alignSelf: 'flex-start', opacity: 0.5 }}>:</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px' }}>{formatTimeUnit(timeSince.seconds)}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Seconds</span>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }}
        onClick={handleCanvasClick}
      >
        {/* White minimal background */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#fff', // White background
          overflow: 'hidden'
        }}>
          {/* Create subtle grid lines for the empty world */}
          <svg 
            width="100%" 
            height="100%" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          >
            {/* Horizontal grid lines */}
            {[...Array(10)].map((_, i) => (
              <line 
                key={`h-${i}`}
                x1="0" 
                y1={`${(i+1) * 10}%`} 
                x2="100%" 
                y2={`${(i+1) * 10}%`} 
                stroke="rgba(0, 0, 0, 0.03)" 
                strokeWidth="1"
              />
            ))}
            
            {/* Vertical grid lines */}
            {[...Array(10)].map((_, i) => (
              <line 
                key={`v-${i}`}
                x1={`${(i+1) * 10}%`} 
                y1="0" 
                x2={`${(i+1) * 10}%`} 
                y2="100%" 
                stroke="rgba(0, 0, 0, 0.03)" 
                strokeWidth="1"
              />
            ))}
          </svg>
          
          {/* Memory boxes (roses) */}
          {memoryBoxes.map((box) => (
            <div 
              key={box.id}
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                transform: 'translate(-50%, -50%)',
                left: `${box.x}%`,
                top: `${box.y}%`,
                zIndex: 5,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* "Tap Here" text */}
              <div style={{
                color: 'rgba(0, 0, 0, 0.7)', // Changed to black
                fontSize: '12px',
                marginBottom: '8px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                background: 'rgba(0, 0, 0, 0.05)', // Light gray background
                padding: '2px 6px',
                borderRadius: '8px'
              }}>
                TAP HERE
              </div>
              
              {/* Rose emoji */}
              <div style={{
                position: 'relative',
                animation: 'float 3s ease-in-out infinite',
                fontSize: '28px',
                filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))' // Subtle shadow
              }}>
                🌹
              </div>
            </div>
          ))}
          
          {/* Player dot with "Gabi" text above - now BLACK */}
          <motion.div 
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            animate={{ 
              left: `${position.x}%`, 
              top: `${position.y}%` 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15 
            }}
          >
            {/* "Gabi" text */}
            <div style={{
              color: 'black', // Changed to black
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              GABI
            </div>
            
            {/* The dot - now BLACK */}
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'black', // Changed to black
              borderRadius: '50%',
              boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow
              animation: 'pulse 2s infinite'
            }}></div>
          </motion.div>
          
          {/* Instructions */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: 0,
            width: '100%',
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.7)', // Changed to black
            fontSize: '14px',
            zIndex: 2,
            pointerEvents: 'none'
          }}>
            <p style={{
              margin: 0,
              padding: '6px 12px',
              background: 'rgba(0, 0, 0, 0.05)', // Light gray background
              borderRadius: '10px',
              display: 'inline-block'
            }}>
              Click anywhere to move Gabi. Find roses 🌹 to discover our memories.
            </p>
          </div>
        </div>
      </div>
      
      {/* Memory viewer */}
      {activeMemory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Changed to white
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '600px',
            padding: '30px',
            backgroundColor: 'white', // Changed to white
            border: '1px solid rgba(0, 0, 0, 0.1)', // Changed to black
            borderRadius: '10px',
            color: 'black', // Changed to black
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Lighter shadow
            overflow: 'hidden'
          }}>
            <button 
              onClick={closeMemory}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '30px',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(0, 0, 0, 0.6)', // Changed to black
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ✕
            </button>
            
            <h2 style={{
              margin: '0 0 5px 0',
              fontSize: '24px',
              color: 'black', // Changed to black
              fontWeight: 'normal'
            }}>
              {activeMemory.title}
            </h2>
            
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.6)' // Changed to black
            }}>
              {activeMemory.date}
            </p>
            
            <div style={{
              width: '100%',
              height: '300px',
              marginBottom: '20px',
              overflow: 'hidden',
              borderRadius: '5px',
              backgroundColor: '#f5f5f5', // Changed to light gray
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={activeMemory.image}
                alt={activeMemory.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'none', // Removed grayscale filter
                  transition: 'filter 0.5s ease'
                }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.src = "/memories/placeholder.jpg";
                }}
              />
            </div>
            
            <p style={{
              margin: '0 0 25px 0',
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'rgba(0, 0, 0, 0.8)' // Changed to black
            }}>
              {activeMemory.description}
            </p>
            
            <button 
              onClick={nextMemory}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: 'black', // Changed to black
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Next Memory <span style={{ marginLeft: '8px' }}>&gt;</span>
            </button>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes glow {
          from {
            opacity: 0.5;
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
          }
          to {
            opacity: 1;
            box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default GabiPageWrapper;