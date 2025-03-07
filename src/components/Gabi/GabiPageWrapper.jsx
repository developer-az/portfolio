'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import split components
import PolaroidLoadingScreen from './PolaroidLoadingScreen';
import MemoryIsland from './MemoryIsland';
import AuthScreen from './AuthScreen';
import MissYouScreen from './MissYouScreen';

const GabiPageWrapper = () => {
  // Authentication state
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Phase state: "polaroid" -> "missyou" -> "memoryisland"
  const [showPhase, setShowPhase] = useState("polaroid");
  
  // Timer state
  const [timeSince, setTimeSince] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Custom memory data with your specific images
  const customMemories = [
    {
      id: 1,
      x: 20,
      y: 30,
      title: "Mirror Selfie",
      date: "January 4, 2025",
      image: "/memories/image1.jpg", // First mirror selfie
      description: "Taking mirror selfies together with the digital camera."
    },
    {
      id: 2,
      x: 70,
      y: 40,
      title: "Dorm Hallway",
      date: "January 9, 2025",
      image: "/memories/image2.jpg", // Second hallway selfie
      description: "Taking photos together in the dorm hallway."
    },
    {
      id: 3,
      x: 30,
      y: 65,
      title: "Shopping Together",
      date: "January 9, 2025",
      image: "/memories/image3.jpg", // Third shopping image
      description: "Shopping for clothes and trying on new outfits together."
    },
    {
      id: 4,
      x: 65,
      y: 75,
      title: "First Date",
      date: "January 7, 2025",
      image: "/memories/image1.jpg", // Using first image again as placeholder
      description: "Our first date when we went out for coffee and talked for hours."
    },
    {
      id: 5,
      x: 50,
      y: 50,
      title: "Study Session",
      date: "January 8, 2025",
      image: "/memories/image2.jpg", // Using second image again as placeholder
      description: "Studying together in the library until closing time."
    }
  ];

  // Authentication check
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
  
  // Phase transitions - first show Polaroid, then "I miss you", then Memory Island
  useEffect(() => {
    if (isAuthorized) {
      // First show the Polaroid slideshow for 10 seconds
      const polaroidTimer = setTimeout(() => {
        console.log("Switching to 'I miss you' phase");
        setShowPhase("missyou");
        
        // Then show the "I miss you" screen for 3 seconds
        const missYouTimer = setTimeout(() => {
          console.log("Switching to Memory Island phase");
          setShowPhase("memoryisland");
        }, 2000);
        
        return () => clearTimeout(missYouTimer);
      }, 10000);
      
      return () => clearTimeout(polaroidTimer);
    }
  }, [isAuthorized]);
  
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

  // Debug logging to check image paths
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Custom memories being used:', customMemories);
      console.log('Image paths:');
      customMemories.forEach(memory => {
        console.log(`- ${memory.title}: ${memory.image}`);
      });
      console.log('Current phase:', showPhase);
    }
  }, [showPhase]);

  return (
    <>
      {/* Authentication Screen */}
      {!isAuthorized && (
        <AuthScreen setIsAuthorized={setIsAuthorized} />
      )}
      
      {/* Polaroid Loading Screen - first phase after authorization */}
      {isAuthorized && showPhase === "polaroid" && (
        <PolaroidLoadingScreen memories={customMemories} />
      )}
      
      {/* "I miss you" Screen - second phase */}
      {isAuthorized && showPhase === "missyou" && (
        <MissYouScreen />
      )}
      
      {/* Memory Island - final phase */}
      {isAuthorized && showPhase === "memoryisland" && (
        <MemoryIsland memoryBoxes={customMemories} timeSince={timeSince} />
      )}
    </>
  );
};

export default GabiPageWrapper;