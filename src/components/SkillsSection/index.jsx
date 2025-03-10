import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './SkillsSection.module.scss';

// Skill categories and items
const skillsData = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", level: 90, icon: "python" },
      { name: "JavaScript", level: 85, icon: "javascript" },
      { name: "Java", level: 80, icon: "java" },
      { name: "C", level: 75, icon: "c" },
      { name: "HTML", level: 95, icon: "html" },
      { name: "CSS", level: 90, icon: "css" }
    ]
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      { name: "React", level: 88, icon: "react" },
      { name: "Next.js", level: 82, icon: "nextjs" },
      { name: "Node.js", level: 78, icon: "nodejs" },
      { name: "Express", level: 75, icon: "express" },
      { name: "Data Science Libraries", level: 85, icon: "data" }
    ]
  },
  {
    category: "Tools & Methodologies",
    skills: [
      { name: "Git", level: 92, icon: "git" },
      { name: "Agile/Scrum", level: 88, icon: "agile" },
      { name: "UI/UX Design", level: 85, icon: "uiux" },
      { name: "Object-Oriented Programming", level: 90, icon: "oop" },
      { name: "GitHub", level: 95, icon: "github" }
    ]
  }
];

// Icon components mapping
const IconComponents = {
  python: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"></path>
      <path d="M12 15h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"></path>
      <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z"></path>
    </svg>
  ),
  javascript: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 20A9 9 0 1 0 6.2 20"></path>
      <path d="M12 13V2"></path>
    </svg>
  ),
  java: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7.5a2.5 2.5 0 0 0-5 0V12a5 5 0 0 1-10 0Z"></path>
    </svg>
  ),
  c: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4Z"></path>
      <path d="M9 11h.01"></path>
      <path d="M14 11h.01"></path>
    </svg>
  ),
  html: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 4 1.5 9h-4L12 4"></path>
      <path d="M8 15h8"></path>
      <path d="M14 19v-3"></path>
      <path d="M10 19v-3"></path>
      <path d="M4 7V4h16v3"></path>
      <path d="M4 7v13h16V7"></path>
    </svg>
  ),
  css: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2l2 19 6 2 6-2 2-19Z"></path>
      <path d="M7 8h10l-1 8-4 2-4-2-.5-4"></path>
    </svg>
  ),
  react: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5A9.77 9.77 0 0 1 12 17a9.77 9.77 0 0 1-8.82-5.5A9.77 9.77 0 0 1 12 6z"></path>
    </svg>
  ),
  nextjs: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h5"></path>
      <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0Z"></path>
      <path d="M17 12h4"></path>
    </svg>
  ),
  nodejs: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8"></path>
      <path d="M8 15V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10"></path>
      <path d="M3 10v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8"></path>
      <path d="M19 10H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"></path>
    </svg>
  ),
  express: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5h20"></path>
      <path d="M3 6v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6"></path>
      <path d="M10 3v3"></path>
      <path d="M14 3v3"></path>
    </svg>
  ),
  data: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"></path>
      <path d="m19 9-5 5-4-4-3 3"></path>
    </svg>
  ),
  git: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="8" x2="16" y2="16"></line>
      <line x1="16" y1="8" x2="8" y2="16"></line>
    </svg>
  ),
  agile: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M17 24a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M10 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M3 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M3 24a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    </svg>
  ),
  uiux: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  ),
  oop: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h6v4l-2 2H3V3Z"></path>
      <path d="M14 3h7v6h-7V3Z"></path>
      <path d="M10 21V8L8 6"></path>
      <path d="M17.5 15.5 19 19h-6l1.5-3.5"></path>
      <path d="M14 3v4"></path>
      <path d="M14 21h7v-6h-7v6Z"></path>
    </svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  )
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  
  return (
    <section ref={sectionRef} className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Technical Skills</h2>
          <p className={styles.sectionDescription}>
            My expertise spans across various programming languages, frameworks, and methodologies.
          </p>
        </div>
        
        <div className={styles.skillsContainer}>
          {/* Category Navigation */}
          <div className={styles.categoryNav}>
            {skillsData.map((category, index) => (
              <button
                key={index}
                className={`${styles.categoryButton} ${activeCategory === index ? styles.active : ''}`}
                onClick={() => setActiveCategory(index)}
              >
                {category.category}
              </button>
            ))}
          </div>
          
          {/* Skills Display */}
          <motion.div 
            className={styles.skillsDisplay}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {skillsData[activeCategory].skills.map((skill, index) => (
              <motion.div 
                key={index} 
                className={styles.skillItem}
                variants={categoryVariants}
              >
                <div className={styles.skillInfo}>
                  <div className={styles.iconWrapper}>
                    {IconComponents[skill.icon]}
                  </div>
                  <div className={styles.skillDetails}>
                    <h3 className={styles.skillName}>{skill.name}</h3>
                    
                    <div className={styles.skillBar}>
                      <motion.div 
                        className={styles.skillProgress} 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                      />
                    </div>
                    
                    <div className={styles.skillLevel}>
                      <span>{skill.level}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeElement1}></div>
      <div className={styles.decorativeElement2}></div>
    </section>
  );
};

export default SkillsSection;