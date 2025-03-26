import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ProfileSection.module.scss';

const ProfileSection = () => {
  const sectionRef = useRef(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax values
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section ref={sectionRef} className={styles.profileSection} id="about">
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Cross decorations */}
          <div className={styles.crossDecoration}></div>
          <div className={`${styles.crossDecoration} ${styles.crossRight}`}></div>
          
          {/* Card content */}
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.headerLine}></div>
              <h2 className={styles.headerText}>HELLO!</h2>
              <div className={styles.headerLine}></div>
            </div>
            
            {/* Profile columns */}
            <div className={styles.profileColumns}>
              {/* Image column */}
              <motion.div 
                className={styles.imageCol}
                style={{ y: imageY }}
                variants={itemVariants}
              >
                <motion.div 
                  className={styles.imageContainer}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Decorative circles */}
                  <div className={`${styles.decorativeCircle} ${styles.circle1}`}></div>
                  <div className={`${styles.decorativeCircle} ${styles.circle2}`}></div>
                  <div className={`${styles.decorativeCircle} ${styles.circle3}`}></div>
                  
                  {/* Decorative crosses */}
                  <div className={`${styles.decorativeCross} ${styles.cross1}`}></div>
                  <div className={`${styles.decorativeCross} ${styles.cross2}`}></div>
                  <div className={`${styles.decorativeCross} ${styles.cross3}`}></div>
                  <div className={`${styles.decorativeCross} ${styles.cross4}`}></div>
                  
                  <Image
                    src="/images/1.png"
                    alt="Anthony Zhou"
                    width={400}
                    height={480}
                    className={styles.profileImage}
                    priority
                  />
                  <div className={styles.imageOverlay}></div>
                  <div className={styles.imageBorder}></div>
                </motion.div>
              </motion.div>
              
              {/* Info column */}
              <motion.div 
                className={styles.infoCol}
                style={{ y: contentY }}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <h1 className={styles.name}>ANTHONY ZHOU</h1>
                  <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Software Engineer & Web Designer</h2>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={styles.tagline} 
                  variants={itemVariants}
                >
                  <span className={styles.taglineText}>
                    Crafting elegant solutions with code
                  </span>
                </motion.div>
                
                <motion.div 
                  className={styles.qualifications} 
                  variants={itemVariants}
                >
                  <div className={styles.qualificationItem}>
                    <div className={styles.qualHeading}>
                      <div className={styles.bullet}></div>
                      <h3>Education</h3>
                    </div>
                    <p>University of Maryland, College Park '27 Computer Science, Data Science Track</p>
                  </div>
                  <div className={styles.qualificationItem}>
                    <div className={styles.qualHeading}>
                      <div className={styles.bullet}></div>
                      <h3>Specialization</h3>
                    </div>
                    <p>Full-stack development, React/Next.js, Java & Python</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={styles.statRow} 
                  variants={containerVariants}
                >
                  <motion.div 
                    className={styles.stat}
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: "0 8px 0 var(--primary-color)" }}
                  >
                    <span className={styles.statNumber}>3+</span>
                    <span className={styles.statLabel}>Years Experience</span>
                  </motion.div>
                  
                  <motion.div 
                    className={styles.stat}
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: "0 8px 0 var(--primary-color)" }}
                  >
                    <span className={styles.statNumber}>15+</span>
                    <span className={styles.statLabel}>Projects</span>
                  </motion.div>
                  
                  <motion.div 
                    className={styles.stat}
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: "0 8px 0 var(--primary-color)" }}
                  >
                    <span className={styles.statNumber}>5+</span>
                    <span className={styles.statLabel}>Tech Stack</span>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className={styles.buttons} 
                  variants={containerVariants}
                >
                  <motion.a 
                    href="#contact" 
                    className={`${styles.button} ${styles.primaryButton}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CONTACT
                  </motion.a>
                  
                  <motion.a 
                    href="#work" 
                    className={`${styles.button} ${styles.secondaryButton}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    VIEW PROJECTS
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Card footer */}
          <div className={styles.cardFooter}>
            <div className={styles.footerLine}></div>
            <div className={styles.footerLogo}>
              <div className={styles.footerDiamond}></div>
              <div className={styles.footerCross}></div>
              <div className={styles.footerDiamond}></div>
            </div>
            <div className={styles.footerLine}></div>
          </div>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className={styles.decorativeSplash}></div>
      <div className={`${styles.decorativeSplash} ${styles.splash2}`}></div>
      
      {/* Background crosses */}
      <div className={`${styles.bgCross} ${styles.bgCross1}`}></div>
      <div className={`${styles.bgCross} ${styles.bgCross2}`}></div>
      <div className={`${styles.bgCross} ${styles.bgCross3}`}></div>
      <div className={`${styles.bgCross} ${styles.bgCross4}`}></div>
    </section>
  );
};

export default React.memo(ProfileSection);