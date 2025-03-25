import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ContactSection.module.scss';

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
  const [activeField, setActiveField] = useState(null);
  
  // Refs for animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form input focus/blur
  const handleFocus = (field) => {
    setActiveField(field);
  };
  
  const handleBlur = () => {
    setActiveField(null);
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
      setSubmitted(true);
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section ref={sectionRef} className={styles.contactSection} id="contact">
      {/* Decorative background elements */}
      <div className={`${styles.decorativeElement} ${styles.element1}`}></div>
      <div className={`${styles.decorativeElement} ${styles.element2}`}></div>
      <div className={`${styles.decorativeElement} ${styles.element3}`}></div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.headerLine}></div>
          <h2 className={styles.title}>CONTACT</h2>
          <div className={styles.headerLine}></div>
        </motion.div>
        
        <div className={styles.contactWrapper}>
          {/* Contact Info Side */}
          <motion.div
            className={styles.contactInfo}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3 
              className={styles.infoHeader}
              variants={itemVariants}
            >
              GET IN TOUCH
            </motion.h3>
            
            <div className={styles.infoItems}>
              <motion.div 
                className={styles.infoItem}
                variants={itemVariants}
              >
                <div className={styles.infoIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>TELEPHONE</div>
                  <div className={styles.infoValue}>(240) 390-5571</div>
                </div>
              </motion.div>
              
              <motion.div 
                className={styles.infoItem}
                variants={itemVariants}
              >
                <div className={styles.infoIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>EMAIL</div>
                  <div className={styles.infoValue}>azhou112@umd.edu</div>
                </div>
              </motion.div>
              
              <motion.div 
                className={styles.infoItem}
                variants={itemVariants}
              >
                <div className={styles.infoIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>LOCATION</div>
                  <div className={styles.infoValue}>Columbia, MD</div>
                </div>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants}>
              <h3 className={styles.socialHeader}>SOCIAL MEDIA</h3>
              <div className={styles.socialLinks}>
                <motion.a 
                  href="https://www.linkedin.com/in/anthony--zhou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://github.com/developer-az" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://www.instagram.com/anthonyyzhou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form Side */}
          <motion.div
            className={styles.formContainer}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div 
              className={styles.formBox}
              variants={itemVariants}
            >
              {submitted ? (
                <div className={styles.formSuccess}>
                  <div className={styles.successIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>MESSAGE SENT</h3>
                  <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div 
                    className={`${styles.formGroup} ${
                      activeField === 'name' || formState.name ? styles.active : ''
                    }`}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={styles.formInput}
                      value={formState.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      placeholder="Name"
                    />
                    <label htmlFor="name" className={styles.formLabel}>NAME</label>
                  </div>
                  
                  <div 
                    className={`${styles.formGroup} ${
                      activeField === 'email' || formState.email ? styles.active : ''
                    }`}
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={styles.formInput}
                      value={formState.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      placeholder="Email"
                    />
                    <label htmlFor="email" className={styles.formLabel}>EMAIL</label>
                  </div>
                  
                  <div 
                    className={`${styles.formGroup} ${
                      activeField === 'subject' || formState.subject ? styles.active : ''
                    }`}
                  >
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className={styles.formInput}
                      value={formState.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={handleBlur}
                      placeholder="Subject"
                    />
                    <label htmlFor="subject" className={styles.formLabel}>SUBJECT</label>
                  </div>
                  
                  <div 
                    className={`${styles.formGroup} ${
                      activeField === 'message' || formState.message ? styles.active : ''
                    }`}
                  >
                    <textarea
                      id="message"
                      name="message"
                      className={styles.formTextarea}
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      placeholder="Message"
                    />
                    <label htmlFor="message" className={styles.formLabel}>MESSAGE</label>
                  </div>
                  
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner}></span>
                        <span className={styles.buttonText}>SENDING</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.buttonText}>SEND MESSAGE</span>
                        <span className={styles.buttonIcon}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      </>
                    )}
                  </button>
                  
                  {error && (
                    <div className={styles.formError}>
                      {error}
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;