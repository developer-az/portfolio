import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ProjectDetailModal.module.scss';

const ProjectDetailModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div 
      className={styles.modalBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={modalRef}
        className={styles.modalContainer}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* YSL Corner Decorations */}
        <div className={styles.cornerTL}></div>
        <div className={styles.cornerTR}></div>
        <div className={styles.cornerBL}></div>
        <div className={styles.cornerBR}></div>
        
        {/* YSL Close Button */}
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close modal"
        >
          <span className={styles.closeX}></span>
        </button>
        
        <div className={styles.modalContent}>
          {/* Image Section with YSL Styling */}
          <div className={styles.projectImageContainer}>
            <div 
              className={styles.projectImage}
              style={{ backgroundImage: `url(${project.gif || project.image})` }}
            />
            
            <div className={styles.yslOverlay}>
              <div className={styles.yslLogo}>~</div>
            </div>
            
            {/* Tech Badges in YSL Style */}
            <div className={styles.projectTechBadges}>
              {project.technologies.map((tech, index) => (
                <span key={index} className={styles.techBadge}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Project Details in YSL Style */}
          <div className={styles.projectDetails}>
            <div className={styles.detailsHeader}>
              <span className={styles.headerLine}></span>
              <h2 className={styles.projectTitle}>{project.title}</h2>
            </div>
            
            <div className={styles.projectDescription}>
              <p>{project.longDescription || project.description}</p>
            </div>
            
            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <div className={styles.projectFeatures}>
                <h3>CARACTÉRISTIQUES</h3>
                <ul className={styles.featuresList}>
                  {project.features.map((feature, index) => (
                    <li key={index}>
                      <span className={styles.featureBullet}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* YSL-styled Links */}
            <div className={styles.projectLinks}>
              <div className={styles.linksHeader}>
                <span className={styles.linkHeaderLine}></span>
                <span className={styles.linkHeaderText}>DISCOVER</span>
                <span className={styles.linkHeaderLine}></span>
              </div>
              
              <div className={styles.linksWrapper}>
                {project.demoLink && (
                  <Link
                    href={project.demoLink}
                    className={`${styles.projectLink} ${styles.demoLink}`}
                    target={project.demoLink.startsWith('/') ? '_self' : '_blank'}
                    rel={project.demoLink.startsWith('/') ? '' : 'noopener noreferrer'}
                  >
                    <span className={styles.linkText}>VIEW LIVE EXPERIENCE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                )}
                
                {project.repoLink && (
                  <a
                    href={project.repoLink}
                    className={`${styles.projectLink} ${styles.codeLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.linkText}>SOURCE CODE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            {/* YSL Footer Signature */}
            <div className={styles.yslFooter}>
              <div className={styles.footerLine}></div>
              <div className={styles.yslSignature}>ANTHONY ZHOU</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailModal;