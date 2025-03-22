import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './SkillsSection.module.scss';

// Skill data with hours and ranks
const skillsData = {
  languages: [
    { name: "Python", hours: 450, rank: "#1" },
    { name: "JavaScript", hours: 420, rank: "#2" },
    { name: "Java", hours: 380, rank: "#3" },
    { name: "HTML/CSS", hours: 350, rank: "#4" },
    { name: "C", hours: 200, rank: "#5" }
    // Can easily add more items here and they will scale properly
  ],
  frameworks: [
    { name: "React", hours: 380, rank: "#1" },
    { name: "Next.js", hours: 320, rank: "#2" },
    { name: "Node.js", hours: 260, rank: "#3" },
    { name: "Express", hours: 160, rank: "#4" },
    { name: "Data Science", hours: 130, rank: "#5" }
    // Can easily add more items here and they will scale properly
  ],
  tools: [
    { name: "Git", hours: 300, rank: "#1" },
    { name: "Agile/Scrum", hours: 250, rank: "#2" },
    { name: "UI/UX Design", hours: 230, rank: "#3" },
    { name: "OOP", hours: 210, rank: "#4" },
    { name: "GitHub", hours: 180, rank: "#5" }
    // Can easily add more items here and they will scale properly
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      duration: 0.5
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

// Skill bar component
const SkillBar = ({ skill, index, maxHours, colorClass }) => {
  const percentage = Math.min(100, (skill.hours / maxHours) * 100);
  
  return (
    <motion.div 
      className={styles.skillBar}
      variants={itemVariants}
      custom={index}
    >
      <div className={styles.skillInfo}>
        <div className={`${styles.rankBadge} ${styles[colorClass]}`}>
          {skill.rank}
        </div>
        <h3 className={styles.skillName}>{skill.name}</h3>
      </div>
      <div className={styles.barAndHours}>
        <div className={styles.barContainer}>
          <motion.div 
            className={`${styles.barFill} ${styles[colorClass]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: 0.1 + (index * 0.05) }}
          />
        </div>
        <span className={styles.skillHours}>{skill.hours} hrs</span>
      </div>
    </motion.div>
  );
};

// Skills category component
const SkillsCategory = ({ title, skills, colorClass }) => {
  // Find the maximum hours to scale the bars appropriately
  const maxHours = Math.max(...skills.map(skill => skill.hours));
  
  return (
    <motion.div 
      className={styles.skillsCategory}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className={`${styles.categoryHeader} ${styles[colorClass]}`}>
        <h2 className={styles.categoryTitle}>{title}</h2>
      </div>
      
      <div className={styles.skillsList}>
        {skills.map((skill, index) => (
          <SkillBar 
            key={`${title}-${skill.name}`} 
            skill={skill} 
            index={index}
            maxHours={maxHours}
            colorClass={colorClass}
          />
        ))}
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const sectionRef = useRef(null);
  
  // Calculate total hours across all skills
  const totalHours = Object.values(skillsData).flat().reduce((sum, skill) => sum + skill.hours, 0);
  
  return (
    <section ref={sectionRef} className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.spotifyLogo}>
              <span className={styles.spotifyCircle}></span>
              <span className={styles.spotifyCircle}></span>
              <span className={styles.spotifyCircle}></span>
            </span>
            Anthony's Yearly Coding Wrapped
          </h2>
          <p className={styles.sectionSubtitle}>Skills & expertise at a glance</p>
        </div>
        
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>{totalHours.toLocaleString()}+</h3>
            <p className={styles.statLabel}>Total Hours Coded</p>
          </div>
          
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>6</h3>
            <p className={styles.statLabel}>Projects Completed</p>
          </div>
          
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>2</h3>
            <p className={styles.statLabel}>New Certifications</p>
          </div>
        </div>
        
        <div className={styles.skillsGrid}>
          <SkillsCategory 
            title="Programming Languages" 
            skills={skillsData.languages}
            colorClass="colorPink"
          />
          
          <SkillsCategory 
            title="Frameworks & Libraries" 
            skills={skillsData.frameworks}
            colorClass="colorBlue"
          />
          
          <SkillsCategory 
            title="Tools & Methodologies" 
            skills={skillsData.tools}
            colorClass="colorGreen"
          />
        </div>
      </div>
      
      {/* Decorative backgrounds */}
      <div className={styles.bg1}></div>
      <div className={styles.bg2}></div>
      <div className={styles.bg3}></div>
    </section>
  );
};

export default SkillsSection;