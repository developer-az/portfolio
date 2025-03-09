import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ProfileSection.module.scss';

const ProfileSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect values
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  
  return (
    <section ref={sectionRef} className={styles.profileSection}>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.imageCol}>
                <motion.div 
                  className={styles.imageContainer}
                  style={{ y: imageY }}
                >
                  <Image
                    src="/images/IMG.png"
                    alt="Anthony Zhou"
                    width={400}
                    height={400}
                    className={styles.profileImage}
                    priority
                  />
                  
                  {/* Floating elements for 3D effect */}
                  <div className={`${styles.floatingElement} ${styles.element1}`}></div>
                  <div className={`${styles.floatingElement} ${styles.element2}`}></div>
                  <div className={`${styles.floatingElement} ${styles.element3}`}></div>
                </motion.div>
              </div>
              
              <motion.div 
                className={styles.infoCol}
                style={{ y: contentY, opacity }}
              >
                <h1 className={styles.name}>Anthony Zhou</h1>
                <h2 className={styles.title}>Software Engineer & Web Designer</h2>
                
                <div className={styles.tagline}>
                  <span className={styles.taglineText}>Creating innovative digital experiences</span>
                </div>
                
                <p className={styles.bio}>
                  I'm a passionate developer dedicated to building exceptional software solutions and 
                  user experiences. With expertise in full-stack development and UI/UX design---Currently looking for Software Engineering Roles.
                </p>
                
                <div className={styles.statRow}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>3+</span>
                    <span className={styles.statLabel}>Years Experience</span>
                  </div>
                  
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>15+</span>
                    <span className={styles.statLabel}>Projects</span>
                  </div>
                  
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>5+</span>
                    <span className={styles.statLabel}>Technologies</span>
                  </div>
                </div>
                
                <div className={styles.buttons}>
                  <a href="#contact" className={`${styles.button} ${styles.primaryButton}`}>
                    Get in Touch
                  </a>
                  <a href="#work" className={`${styles.button} ${styles.secondaryButton}`}>
                    View Projects
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeGrid}></div>
      <div className={styles.decorativeBlur}></div>
    </section>
  );
};

export default ProfileSection;