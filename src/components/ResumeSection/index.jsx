import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import styles from './ResumeSection.module.scss';

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

const ResumeSection = () => {
  // Resume data
  const resumeData = {
    education: [
      {
        id: 1,
        degree: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
        institution: "University of Maryland, College Park",
        location: "College Park, MD",
        period: "2023 - 2027",
        description: "Data Science Track, with Focus on software engineering and web development. Minoring in Information Risk Management, Ethics, and Privacy."
      }
    ],
    experience: [
      {
        id: 1,
        role: "UNDERGRADUATE TEACHING ASSISTANT",
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
        role: "ORIENTATION ADVISOR",
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
      technical: ["Python", "JavaScript", "React", "Next.js", "Java", "C", "HTML/CSS", "Data Analysis", "Git", "SQL", "Docker", "Flutter"],
      soft: ["Problem Solving", "Team Leadership", "Project Management", "Scrum", "Agile Development", "Public Speaking"]
    },
    certifications: [
      {
        id: 1,
        name: "FRONTEND WEB DEVELOPMENT",
        issuer: "University of Maryland",
        date: "2023"
      },
      {
        id: 2,
        name: "PYTHON TECHNICAL PREPARATION",
        issuer: "Code Path",
        date: "2025"
      }
    ]
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState("skills");
  
  // Refs for animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section ref={sectionRef} className={styles.resumeSection} id="resume">
      <div className={styles.bgLines}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={styles.bgLine}></div>
        ))}
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.headerLine}></div>
          <h2 className={styles.title}>MY RESUME</h2>
          <div className={styles.headerLine}></div>
        </motion.div>
        
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <motion.div 
              className={styles.profileImage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/images/1.png"
                alt="Anthony Zhou"
                width={300}
                height={300}
                className={styles.image}
                priority
              />
              <div className={styles.imageBorder}></div>
            </motion.div>
            
            <div className={styles.tabs}>
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  className={`${styles.tabButton} ${activeTab === "skills" ? styles.active : ""}`}
                  onClick={() => setActiveTab("skills")}
                >
                  <span className={styles.tabLine}></span>
                  <span className={styles.tabText}>SKILLS</span>
                </button>

                <button
                  className={`${styles.tabButton} ${activeTab === "experience" ? styles.active : ""}`}
                  onClick={() => setActiveTab("experience")}
                >
                  <span className={styles.tabLine}></span>
                  <span className={styles.tabText}>EXPERIENCE</span>
                </button>
                
                <button
                  className={`${styles.tabButton} ${activeTab === "education" ? styles.active : ""}`}
                  onClick={() => setActiveTab("education")}
                >
                  <span className={styles.tabLine}></span>
                  <span className={styles.tabText}>EDUCATION</span>
                </button>
                
                <button
                  className={`${styles.tabButton} ${activeTab === "certifications" ? styles.active : ""}`}
                  onClick={() => setActiveTab("certifications")}
                >
                  <span className={styles.tabLine}></span>
                  <span className={styles.tabText}>CERTIFICATIONS</span>
                </button>
              </motion.nav>
              
              <motion.a 
                href="/resume.pdf" 
                download="Anthony_Zhou_Resume.pdf"
                className={styles.downloadButton}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.downloadText}>DOWNLOAD RESUME</span>
                <span className={styles.downloadIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </span>
              </motion.a>
            </div>
          </div>
          
          <div className={styles.mainContent}>
            <AnimatePresence mode="wait">
              {activeTab === "experience" && (
                <motion.div
                  key="experience"
                  className={styles.tabContent}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.timelineContainer}>
                    {resumeData.experience.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        className={styles.timelineItem}
                        variants={itemVariants}
                      >
                        <div className={styles.timelineHeader}>
                          <div className={styles.timelineDot}></div>
                          <div className={styles.timelinePeriod}>{item.period}</div>
                          <h3 className={styles.timelineTitle}>{item.role}</h3>
                        </div>
                        
                        <div className={styles.timelineBody}>
                          <div className={styles.timelineCompany}>
                            {item.company} | {item.location}
                          </div>
                          <ul className={styles.timelineList}>
                            {item.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === "education" && (
                <motion.div
                  key="education"
                  className={styles.tabContent}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.timelineContainer}>
                    {resumeData.education.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        className={styles.timelineItem}
                        variants={itemVariants}
                      >
                        <div className={styles.timelineHeader}>
                          <div className={styles.timelineDot}></div>
                          <div className={styles.timelinePeriod}>{item.period}</div>
                          <h3 className={styles.timelineTitle}>{item.degree}</h3>
                        </div>
                        
                        <div className={styles.timelineBody}>
                          <div className={styles.timelineCompany}>
                            {item.institution} | {item.location}
                          </div>
                          <p className={styles.timelineDescription}>{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === "skills" && (
                <motion.div
                  key="skills"
                  className={styles.tabContent}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.skillsContainer}>
                    <motion.div 
                      className={styles.skillsColumn}
                      variants={itemVariants}
                    >
                      <h3 className={styles.skillsTitle}>TECHNICAL SKILLS</h3>
                      <div className={styles.skillsGrid}>
                        {resumeData.skills.technical.map((skill, index) => (
                          <motion.div 
                            key={index} 
                            className={styles.skillItem}
                            whileHover={{ scale: 1.05 }}
                          >
                            {skill}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className={styles.skillsColumn}
                      variants={itemVariants}
                    >
                      <h3 className={styles.skillsTitle}>SOFT SKILLS</h3>
                      <div className={styles.skillsGrid}>
                        {resumeData.skills.soft.map((skill, index) => (
                          <motion.div 
                            key={index} 
                            className={styles.skillItem}
                            whileHover={{ scale: 1.05 }}
                          >
                            {skill}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "certifications" && (
                <motion.div
                  key="certifications"
                  className={styles.tabContent}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.certificationsContainer}>
                    {resumeData.certifications.map((cert, index) => (
                      <motion.div 
                        key={cert.id}
                        className={styles.certificationItem}
                        variants={itemVariants}
                      >
                        <div className={styles.certBadge}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <polyline points="9 10 12 13 15 10"></polyline>
                          </svg>
                        </div>
                        <div className={styles.certContent}>
                          <h3 className={styles.certName}>{cert.name}</h3>
                          <div className={styles.certInfo}>
                            {cert.issuer} <span className={styles.certDot}>•</span> {cert.date}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className={styles.cornerDecoration}></div>
    </section>
  );
};

export default ResumeSection;