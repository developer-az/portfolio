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
  // State for hover effects and error handling
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  
  // Motion values for 3D card effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // Transform mouse position into rotation values
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  
  // Shine effect position
  const shineX = useTransform(xSpring, [-0.5, 0.5], ["-50%", "150%"]); 
  const shineY = useTransform(ySpring, [-0.5, 0.5], ["-50%", "150%"]);
  
  // Handle mouse movements for 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate position of mouse relative to card center
    const xValue = (e.clientX - rect.left) / width - 0.5;
    const yValue = (e.clientY - rect.top) / height - 0.5;
    
    x.set(xValue);
    y.set(yValue);
  };
  
  // Reset card position when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle card click
  const handleCardClick = (e) => {
    // Don't navigate if user clicked on a link
    if (e.target.closest('a')) {
      return;
    }
    
    if (onClick) {
      onClick();
    } else if (demoLink) {
      window.open(demoLink, '_blank', 'noopener,noreferrer');
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
        cursor: (onClick || demoLink || repoLink) ? 'pointer' : 'default'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
          
          {/* Project image overlay */}
          <motion.div 
            className={styles.projectImageOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.overlayContent}>
              <motion.h4 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {title}
              </motion.h4>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                View Details
              </motion.p>
            </div>
          </motion.div>
          
          {/* Technology tags */}
          <motion.div 
            className={styles.technologies}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {technologies.slice(0, 3).map((tech, index) => (
              <motion.span 
                key={index} 
                className={styles.techTag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10 
                }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.1 + (index * 0.05) 
                }}
              >
                {tech}
              </motion.span>
            ))}
            {technologies.length > 3 && (
              <motion.span 
                className={`${styles.techTag} ${styles.moreBadge}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10 
                }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.3
                }}
              >
                +{technologies.length - 3}
              </motion.span>
            )}
          </motion.div>

          {/* GitHub Icon for Repo Link */}
          {repoLink && (
            <motion.div 
              className={styles.repoIcon} 
              onClick={(e) => {
                e.stopPropagation();
                window.open(repoLink, '_blank', 'noopener,noreferrer');
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </motion.div>
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
                onClick={(e) => e.stopPropagation()}
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
        
        {/* 3D shine effect */}
        <motion.div 
          className={`${styles.shine} ${isHovered ? styles.visible : ''}`} 
          style={{ 
            background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0) 60%)` 
          }}
        />
        
        {/* Shadow effect */}
        <motion.div 
          className={styles.shadow}
          style={{
            transform: isHovered 
              ? `translateX(${-x.get() * 20}px) translateY(${-y.get() * 20}px) scale(0.95)` 
              : "translateX(0) translateY(0) scale(1)"
          }}
        />
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectCard);