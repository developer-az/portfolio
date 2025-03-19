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
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className={styles.modalContent}>
          <div className={styles.projectImageContainer}>
            <div 
              className={styles.projectImage}
              style={{ backgroundImage: `url(${project.gif || project.image})` }}
            />
            
            <div className={styles.projectTechBadges}>
              {project.technologies.map((tech, index) => (
                <span key={index} className={styles.techBadge}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className={styles.projectDetails}>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            
            <div className={styles.projectDescription}>
              <p>{project.longDescription || project.description}</p>
            </div>
            
            {project.features && project.features.length > 0 && (
              <div className={styles.projectFeatures}>
                <h3>Key Features</h3>
                <ul>
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles.projectLinks}>
              {project.demoLink && (
                <Link
                  href={project.demoLink}
                  className={`${styles.projectLink} ${styles.demoLink}`}
                >
                  <span>View Live Demo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
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
                  <span>View Source Code</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailModal;