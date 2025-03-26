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
  
  // Motion values for subtle hover effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 25, stiffness: 200 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // Transform mouse position into rotation values - more subtle for YSL aesthetic
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["-3deg", "3deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  
  // Subtle parallax for inner elements
  const imageY = useTransform(ySpring, [-0.5, 0.5], ["3%", "-3%"]);
  const contentY = useTransform(ySpring, [-0.5, 0.5], ["2%", "-2%"]);
  
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)" }}
    >
      {/* YSL-inspired corner embellishments */}
      <div className={styles.cornerTL}></div>
      <div className={styles.cornerTR}></div>
      <div className={styles.cornerBL}></div>
      <div className={styles.cornerBR}></div>
      
      <div className={styles.content}>
        {/* Project Image Section */}
        <motion.div 
          className={styles.imageContainer}
          style={{ y: isHovered ? imageY : 0 }}
        >
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
          
          {/* YSL-inspired overlay */}
          <motion.div 
            className={styles.projectOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.overlayContent}>
              <motion.div
                className={styles.viewDetails}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 20
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className={styles.viewText}>VIEW DETAILS</span>
                <div className={styles.viewLine}></div>
              </motion.div>
              
              {/* Technology tags in YSL style */}
              <motion.div 
                className={styles.technologies}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 20
                }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {technologies.map((tech, index) => (
                  <span key={index} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Project Info in YSL-inspired style */}
        <motion.div 
          className={styles.projectInfo}
          style={{ y: isHovered ? contentY : 0 }}
        >
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          
          {/* Minimal YSL-inspired links */}
          <div className={styles.links}>
            {demoLink && (
              <Link 
                href={demoLink} 
                className={styles.yslLink} 
                onClick={(e) => e.stopPropagation()}
              >
                <span>EXPLORE</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            )}
            
            {repoLink && (
              <a 
                href={repoLink}
                className={styles.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <span>GITHUB</span>
              </a>
            )}
          </div>
        </motion.div>
        
        {/* YSL-inspired luxurious gold accent */}
        <div className={`${styles.yslAccent} ${isHovered ? styles.active : ''}`}></div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectCard);