import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import styles from './ProjectCard.module.scss';

const ProjectCard = ({ 
  title, 
  description, 
  imageSrc = null,
  demoLink = null,
  repoLink = null,
  technologies = [],
  icon = null,
  iconLabel = "",
  onClick = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics for more natural movement
  const springConfig = { damping: 25, stiffness: 200 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // Transform mouse position into rotation values - reduced for subtlety
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  
  // Handle mouse move on the card
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate position of mouse relative to card center (values between -0.5 and 0.5)
    const xValue = (e.clientX - rect.left) / width - 0.5;
    const yValue = (e.clientY - rect.top) / height - 0.5;
    
    x.set(xValue);
    y.set(yValue);
  };
  
  // Reset card position on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle card click
  const handleCardClick = (e) => {
    // Don't navigate if user clicked on the demo or repo button
    if (e.target.closest('a')) {
      return;
    }
    
    if (onClick) {
      onClick();
    } else if (repoLink) {
      window.open(repoLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      className={styles.projectCard}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        cursor: (onClick || repoLink) ? 'pointer' : 'default'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={styles.content} style={{ transform: "translateZ(0px)" }}>
        {/* Project Image */}
        <div className={styles.imageContainer}>
          {imageSrc && !imageError ? (
            <div 
              className={styles.projectImage}
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%'
              }}
              onError={handleImageError}
            />
          ) : (
            <div className={styles.fallbackImage}>
              {icon ? (
                <div className={styles.iconContainer}>
                  {icon}
                  {iconLabel && <span className={styles.iconLabel}>{iconLabel}</span>}
                </div>
              ) : (
                <div className={styles.projectPlaceholder}>
                  <span>{title.charAt(0)}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Subtle overlay with "View Details" on hover */}
          <motion.div 
            className={styles.projectImageOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.overlayContent}>
              <p>View Details</p>
            </div>
          </motion.div>
          
          {/* Floating technology tags */}
          {technologies.length > 0 && (
            <div className={styles.technologies}>
              {technologies.map((tech, index) => (
                <span key={index} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* GitHub Icon for Repo Link */}
          {repoLink && (
            <div className={styles.repoIcon} onClick={(e) => {
              e.stopPropagation();
              window.open(repoLink, '_blank', 'noopener,noreferrer');
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
          )}
        </div>
        
        {/* Project Info */}
        <div className={styles.projectInfo}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          
          {/* Links */}
          <div className={styles.links}>
            {demoLink && (
              <Link 
                href={demoLink} 
                className={styles.link} 
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking demo link
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Demo
              </Link>
            )}
            
            {repoLink && (
              <a 
                href={repoLink}
                className={`${styles.link} ${styles.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                Code
              </a>
            )}
          </div>
        </div>
        
        {/* Subtle shine effect */}
        <div 
          className={`${styles.shine} ${isHovered ? styles.visible : ''}`} 
          style={{ 
            transform: isHovered 
              ? `translateX(${x.get() * 100}px) translateY(${y.get() * 100}px)` 
              : "translateX(0) translateY(0)" 
          }}
        />
        
        <div 
          className={styles.shadow}
          style={{
            transform: isHovered 
              ? `translateX(${-x.get() * 10}px) translateY(${-y.get() * 10}px) scale(0.98)` 
              : "translateX(0) translateY(0) scale(1)"
          }}
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;