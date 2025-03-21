import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ProfileSection.module.scss';

const ProfileSection = () => {
  const sectionRef = useRef(null);
  
  // Create parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], ['-2%', '5%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['2%', '-5%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0, 1, 1, 0.8]);

  // Card tilt animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
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
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.cardContent}>
            <motion.div 
              className={styles.imageCol}
              style={{ y: imageY }}
            >
              <motion.div 
                className={styles.imageContainer}
                variants={itemVariants}
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/1.png"
                  alt="Anthony Zhou"
                  width={400}
                  height={400}
                  className={styles.profileImage}
                  priority
                />
                <motion.div 
                  className={styles.imageBorder}
                  animate={{ 
                    scale: [1, 1.03, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className={styles.infoCol}
              style={{ y: contentY, opacity }}
              variants={itemVariants}
            >
              <motion.h1 className={styles.name} variants={itemVariants}>Anthony Zhou</motion.h1>
              <motion.h2 className={styles.title} variants={itemVariants}>Software Engineer &amp; Web Designer</motion.h2>
              
              <motion.div className={styles.tagline} variants={itemVariants}>
                <span className={styles.taglineText}>
                  Engineering elegant solutions for complex problems
                </span>
              </motion.div>
              
              <motion.div className={styles.qualifications} variants={itemVariants}>
                <div className={styles.qualificationItem}>
                  <h3>Education</h3>
                  <p>UMD '27 Computer Science, Data Science Track</p>
                </div>
                <div className={styles.qualificationItem}>
                  <h3>Specialization</h3>
                  <p>Full-stack development, React/Next.js, Java &amp; Python</p>
                </div>
              </motion.div>
              
              <motion.div className={styles.statRow} variants={itemVariants}>
                <motion.div 
                  className={styles.stat}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={styles.statNumber}>3+</span>
                  <span className={styles.statLabel}>Years Experience</span>
                </motion.div>
                
                <motion.div 
                  className={styles.stat}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={styles.statNumber}>15+</span>
                  <span className={styles.statLabel}>Projects</span>
                </motion.div>
                
                <motion.div 
                  className={styles.stat}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={styles.statNumber}>5+</span>
                  <span className={styles.statLabel}>Tech Stack</span>
                </motion.div>
              </motion.div>
              
              <motion.div className={styles.buttons} variants={itemVariants}>
                <motion.a 
                  href="#contact" 
                  className={`${styles.button} ${styles.primaryButton}`}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Me
                </motion.a>
                
                <motion.a 
                  href="#work" 
                  className={`${styles.button} ${styles.secondaryButton}`}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Projects
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeGrid}></div>
      <div className={styles.decorativeBlur}></div>
      
      {/* Additional decorative elements */}
      <motion.div
        className={styles.floatingParticle}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className={`${styles.floatingParticle} ${styles.particle2}`}
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </section>
  );
};

export default ProfileSection;