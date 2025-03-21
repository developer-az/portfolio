import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './EnhancedResumeSection.module.scss';

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Resume data with skills integration
const resumeData = {
  education: [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Maryland, College Park",
      location: "College Park, MD",
      period: "2023 - 2027",
      description: "Data Science Track, with Focus on software engineering and web development. Minoring in Information Risk Management, Ethics, and Privacy."
    }
  ],
  experience: [
    {
      id: 1,
      role: "Undergraduate Teaching Assistant",
      company: "Financial Literacy and Stocks (BSOS201)",
      location: "College Park, MD",
      period: "August 2024 - Present",
      responsibilities: [
        "Supported students in grasping stock market trends, Technical Analysis, & Portfolio Management as a Grading & Teaching Assistant utilizing Excel",
        "Engineered the integration of financial modeling software & data visualization tools (TC2000 & IBD) for fall 2024 students, resulting in a +15% surge in personal portfolio performance compared to the previous year"
      ]
    },
    {
      id: 2,
      role: "Orientation Advisor",
      company: "College of Computer, Mathematical, and Natural Sciences",
      location: "College Park, MD",
      period: "May 2024 - January 2025",
      responsibilities: [
        "Facilitated the initial steps for incoming students at the university, offering guidance to over 200 individuals per session using resource guides",
        "Cultivated an inclusive & inviting environment to ensure a seamless transition for new students"
      ]
    }
  ],
  skills: {
    programming: [
      { name: "Python", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "React/Next.js", level: 80 },
      { name: "Java", level: 75 },
      { name: "C", level: 70 },
      { name: "HTML/CSS", level: 95 }
    ],
    tools: [
      { name: "Git", level: 85 },
      { name: "Data Science", level: 80 },
      { name: "SQL", level: 75 },
      { name: "Node.js", level: 70 }
    ],
    soft: [
      { name: "Problem Solving", level: 90 },
      { name: "Team Leadership", level: 85 },
      { name: "Project Management", level: 80 },
      { name: "Communication", level: 95 }
    ]
  },
  certifications: [
    {
      id: 1,
      name: "Frontend Web Development",
      issuer: "University of Maryland",
      date: "2023"
    },
    {
      id: 2,
      name: "Python Technical Preparation",
      issuer: "Code Path",
      date: "2025"
    }
  ]
};

// Custom skill bar component with animation
const SkillBar = ({ skill, index }) => {
  const barRef = useRef(null);
  const isInView = useInView(barRef, { once: true, amount: 0.5 });

  return (
    <motion.div 
      className={styles.skillItem}
      variants={itemVariants}
      ref={barRef}
    >
      <div className={styles.skillDetails}>
        <span className={styles.skillName}>{skill.name}</span>
        <span className={styles.skillLevel}>{skill.level}%</span>
      </div>
      <div className={styles.skillBarContainer}>
        <motion.div 
          className={styles.skillBar}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.barHighlight}></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Timeline item component
const TimelineItem = ({ year, title, subtitle, children, isRight = false }) => {
  return (
    <motion.div 
      className={`${styles.timelineItem} ${isRight ? styles.timelineRight : ''}`}
      variants={itemVariants}
    >
      <div className={styles.timelineMarker}>
        <div className={styles.timelineDate}>{year}</div>
        <div className={styles.timelineDot}></div>
        <div className={styles.timelineLine}></div>
      </div>
      <div className={styles.timelineContent}>
        <h4 className={styles.timelineTitle}>{title}</h4>
        <div className={styles.timelineSubtitle}>{subtitle}</div>
        <div className={styles.timelineBody}>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const EnhancedResumeSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [activeSkillTab, setActiveSkillTab] = useState('programming');
  
  return (
    <section ref={sectionRef} className={styles.resumeSection} id="resume">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Resume &amp; Skills
          </motion.h2>
          <motion.p 
            className={styles.sectionDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My professional experience, skills, and educational background
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a 
              href="/resume.pdf" 
              download="Anthony_Zhou_Resume.pdf"
              className={styles.downloadButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Resume
            </a>
          </motion.div>
        </div>
        
        <div className={styles.resumeContent}>
          {/* Skills Section - Integrated and Enhanced */}
          <motion.div 
            className={styles.skillsSection}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className={styles.resumeSectionTitle}>
              <span className={styles.titleIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </span>
              Technical & Soft Skills
            </h3>
            
            <div className={styles.skillTabs}>
              <motion.button 
                className={`${styles.skillTab} ${activeSkillTab === 'programming' ? styles.active : ''}`}
                onClick={() => setActiveSkillTab('programming')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Programming
                {activeSkillTab === 'programming' && (
                  <motion.div 
                    className={styles.activeTabIndicator}
                    layoutId="tabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
              
              <motion.button 
                className={`${styles.skillTab} ${activeSkillTab === 'tools' ? styles.active : ''}`}
                onClick={() => setActiveSkillTab('tools')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Tools & Libraries
                {activeSkillTab === 'tools' && (
                  <motion.div 
                    className={styles.activeTabIndicator}
                    layoutId="tabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
              
              <motion.button 
                className={`${styles.skillTab} ${activeSkillTab === 'soft' ? styles.active : ''}`}
                onClick={() => setActiveSkillTab('soft')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Soft Skills
                {activeSkillTab === 'soft' && (
                  <motion.div 
                    className={styles.activeTabIndicator}
                    layoutId="tabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </div>
            
            <div className={styles.skillsContainer}>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeSkillTab}
                  className={styles.skillsList}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {resumeData.skills[activeSkillTab].map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Timeline layout for education and experience */}
          <div className={styles.timeline}>
            <motion.div 
              className={styles.timelineWrapper}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className={styles.resumeSectionTitle}>
                <span className={styles.titleIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
                Experience & Education
              </h3>
              
              {/* Timeline for education */}
              {resumeData.education.map((edu, index) => (
                <TimelineItem
                  key={edu.id}
                  year={edu.period}
                  title={edu.degree}
                  subtitle={`${edu.institution}, ${edu.location}`}
                  isRight={index % 2 !== 0}
                >
                  <p>{edu.description}</p>
                </TimelineItem>
              ))}
              
              {/* Timeline for experience */}
              {resumeData.experience.map((exp, index) => (
                <TimelineItem
                  key={exp.id}
                  year={exp.period}
                  title={exp.role}
                  subtitle={`${exp.company}, ${exp.location}`}
                  isRight={(resumeData.education.length + index) % 2 !== 0}
                >
                  <ul className={styles.responsibilities}>
                    {exp.responsibilities.map((responsibility, idx) => (
                      <li key={idx}>{responsibility}</li>
                    ))}
                  </ul>
                </TimelineItem>
              ))}
              
              {/* Certifications */}
              {resumeData.certifications.map((cert, index) => (
                <TimelineItem
                  key={cert.id}
                  year={cert.date}
                  title={cert.name}
                  subtitle={cert.issuer}
                  isRight={(resumeData.education.length + resumeData.experience.length + index) % 2 !== 0}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeGrid}></div>
      <div className={styles.decorativeElement1}></div>
      <div className={styles.decorativeElement2}></div>
    </section>
  );
};

export default EnhancedResumeSection;