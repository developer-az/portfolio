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
  
  // Track loading state to prevent multiple transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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
      title: "conflict",
      date: "January 4, 2025",
      image: "/memories/image1.jpg", // First mirror selfie
      description: "Sometimes i cant get out of bed, heart is aching every second of the day I can't even explain why. I distract myself but I dont want to forget. I cant forget your smile, your presence, I dont want to."
    },
    {
      id: 2,
      x: 70,
      y: 40,
      title: "cold",
      date: "January 4, 2025",
      image: "/memories/image2.jpg", // Second hallway selfie
      description: "you made me feel warm even when i was freezing, you gave heat to my heart. now even if its better outside i wish i could go back to winter to be with you again"
    },
    {
      id: 3,
      x: 30,
      y: 65,
      title: "Pretty girl",
      date: "January 9, 2025",
      image: "/memories/image3.jpg", // Third shopping image
      description: "It feels empty without you for some reason. You made life brighter for me. You don't understand the light that you provided"
    },
    {
      id: 4,
      x: 65,
      y: 75,
      title: "poolesville",
      date: "December 23, 2024",
      image: "/memories/image5.jpg", // Using first image again as placeholder
      description: "I'd be there no matter the distance, the time. You meant everything to me."
    },
    {
      id: 5,
      x: 50,
      y: 50,
      title: "Christmas",
      date: "December 27, 2024",
      image: "/memories/image4.jpg", // Using second image again as placeholder
      description: "You were a gift to me. Being able to receive gifts from you made my heart happy."
    }
  ];

  // Authentication check
  useEffect(() => {
    // Get last visit from localStorage
    const lastVisit = localStorage.getItem('gabiLastVisit');
    const currentTime = new Date().getTime();
    
    // If visited within the last 24 hours, auto-authorize
    if (lastVisit && (currentTime - parseInt(lastVisit)) < 24 * 60 * 60 * 1000) {
      setIsAuthorized(true);
    }
  }, []);
  
  // Function to handle polaroid screen completion
  const handlePolaroidComplete = () => {
    // Prevent multiple transitions
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    console.log("Polaroid sequence complete with all captions shown");
    
    // Transition to "missyou" phase
    setShowPhase("missyou");
    
    // Log the phase change for debugging
    console.log("Phase changed to: missyou");
    
    // Then show the "I miss you" screen for 1.5 seconds
    setTimeout(() => {
      console.log("Switching to Memory Island phase");
      setShowPhase("memoryisland");
      setIsTransitioning(false);
      
      // Log the final phase change for debugging
      console.log("Phase changed to: memoryisland");
    }, 1500);
  };
  
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

  // Debug log for phase changes
  useEffect(() => {
    console.log(`Current phase: ${showPhase}`);
  }, [showPhase]);

  return (
    <>
      {/* Authentication Screen */}
      {!isAuthorized && (
        <AuthScreen setIsAuthorized={setIsAuthorized} />
      )}
      
      {/* Polaroid Loading Screen - first phase after authorization */}
      {isAuthorized && showPhase === "polaroid" && (
        <PolaroidLoadingScreen 
          memories={customMemories.slice(0, 3)} // Only send first 3 memories to avoid confusion
          onComplete={handlePolaroidComplete}
        />
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