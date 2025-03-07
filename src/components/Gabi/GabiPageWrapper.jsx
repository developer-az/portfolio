'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import split components - FIXED PATHS
import PolaroidLoadingScreen from './PolaroidLoadingScreen';
import MemoryIsland from './MemoryIsland';
import AuthScreen from './AuthScreen';
import MemoryViewer from './MemoryViewer';

const GabiPageWrapper = () => {
  // Authentication state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
      date: "April 15, 2024",
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
      y: 50,
      title: "Birthday Surprise",
      date: "October 30, 2023",
      image: "/memories/birthday.jpg",
      description: "I spent weeks planning your surprise party. The look on your face when everyone jumped out was priceless. You told me later it was the most special birthday you'd ever had."
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
  
  // Simulated loading for Polaroid effect
  useEffect(() => {
    if (isAuthorized) {
      // Simulate loading time for Polaroid developing effect
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 6000);
      
      return () => clearTimeout(loadingTimer);
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

  return (
    <>
      {/* Authentication Screen */}
      {!isAuthorized && (
        <AuthScreen setIsAuthorized={setIsAuthorized} />
      )}
      
      {/* Polaroid Loading Screen */}
      {isAuthorized && isLoading && (
        <PolaroidLoadingScreen memories={memoryBoxes} />
      )}
      
      {/* Main Memory Island */}
      {isAuthorized && !isLoading && (
        <MemoryIsland memoryBoxes={memoryBoxes} timeSince={timeSince} />
      )}
    </>
  );
};

export default GabiPageWrapper;