import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import styles from './ContactSection.module.scss';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ContactSection = () => {
  // Form state management
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Refs for animations
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const controls = useAnimation();
  
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Start animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Form validation
  const validateForm = () => {
    const { name, email, subject, message } = formState;
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('All fields are required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send form data to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again later.');
      }
      
      // Handle success
      setSuccessMessage(data.message || "Thank you for your message! I'll get back to you soon.");
      setSubmitted(true);
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Reset submitted state after delay
      setTimeout(() => {
        setSubmitted(false);
      }, 8000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section ref={sectionRef} className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <motion.div 
          className={styles.sectionHeader}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h2 
            className={styles.sectionTitle}
            variants={itemVariants}
          >
            Get In Touch
          </motion.h2>
          
          <motion.p 
            className={styles.sectionDescription}
            variants={itemVariants}
          >
            Let's collaborate on your next project. Feel free to reach out through the form below or connect with me directly.
          </motion.p>
        </motion.div>
        
        <div className={styles.contactWrapper}>
          <motion.div 
            className={styles.contactInfo}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className={styles.infoItem}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className={styles.infoIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Phone</h3>
                <p>(240) 390-5571</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.infoItem}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className={styles.infoIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Email</h3>
                <p>azhou112@umd.edu</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.infoItem}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className={styles.infoIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Location</h3>
                <p>Columbia, MD</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.socialLinks}
              variants={itemVariants}
            >
              <h3>Connect With Me</h3>
              <div className={styles.socialIcons}>
                <motion.a 
                  href="https://www.linkedin.com/in/anthony--zhou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://github.com/developer-az" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://www.instagram.com/anthonyyzhou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className={styles.contactForm}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            ref={formRef}
          >
            <motion.div 
              className={styles.formCard}
              variants={itemVariants}
              whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {submitted ? (
                <motion.div 
                  className={styles.successMessage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className={styles.successIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>{successMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      placeholder="Subject"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="5"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <motion.button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSubmitting ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <>
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </>
                    )}
                  </motion.button>
                  
                  {error && (
                    <motion.p 
                      className={styles.errorMessage}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </form>
              )}
              
              {/* 3D elements */}
              <div className={styles.cardCorner1}></div>
              <div className={styles.cardCorner2}></div>
              <div className={styles.cardCorner3}></div>
              <div className={styles.cardCorner4}></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeCircle1}></div>
      <div className={styles.decorativeCircle2}></div>
      <div className={styles.decorativeGrid}></div>
    </section>
  );
};

export default React.memo(ContactSection);