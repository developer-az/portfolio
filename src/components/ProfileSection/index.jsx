import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ProfileSection.module.scss';

const ProfileSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects for image and content
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={sectionRef} className={styles.profileSection} id="about">
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.02, 
            rotateX: 2, 
            rotateY: 2, 
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)" 
          }}
        >
          <div className={styles.cardContent}>
            <motion.div 
              className={styles.imageCol} 
              style={{ y: imageY }}
            >
              <motion.div 
                className={styles.imageContainer}
                whileHover={{ scale: 1.05, rotate: 1 }}
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
                <div className={styles.imageBorder}></div>
              </motion.div>
            </motion.div>
            <motion.div 
              className={styles.infoCol}
              style={{ y: contentY }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className={styles.name}>Anthony Zhou</h1>
              <h2 className={styles.title}>Current Software Engineer &amp; Web Designer</h2>
              <div className={styles.tagline}>
                <span className={styles.taglineText}>
                  Engineering elegant solutions to complex problems
                </span>
              </div>
              <div className={styles.technicalSnapshot}>
                <h3>UMD 27' Computer Science, Data Science</h3>
                <ul className={styles.expertiseList}>
                  <li>Full-stack architecture design</li>
                  <li>React/Next.js optimization</li>
                  <li>Java &amp; Python Development</li>
                  <li>Mentor &amp; Data Analyst</li>
                </ul>
              </div>
              <div className={styles.statRow}>
                <motion.div 
                  className={styles.stat}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={styles.statIcon}>⚡</span>
                  <span className={styles.statNumber}>3+</span>
                  <span className={styles.statLabel}>Years Experience</span>
                </motion.div>
                <motion.div 
                  className={styles.stat}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={styles.statIcon}>🔧</span>
                  <span className={styles.statNumber}>15+</span>
                  <span className={styles.statLabel}>Projects Delivered</span>
                </motion.div>
                <motion.div 
                  className={styles.stat}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={styles.statIcon}>🚀</span>
                  <span className={styles.statNumber}>5+</span>
                  <span className={styles.statLabel}>Tech Stack Depth</span>
                </motion.div>
              </div>
              <div className={styles.buttons}>
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className={styles.decorativeGrid}></div>
      <div className={styles.decorativeBlur}></div>
    </section>
  );
};

export default ProfileSection;
