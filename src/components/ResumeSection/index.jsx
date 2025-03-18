// src/components/ResumeSection/index.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './ResumeSection.module.scss';

const resumeData = {
  education: [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Maryland, College Park",
      location: "College Park, MD",
      period: "2022 - 2026",
      description: "Focus on software engineering, data science, and web development."
    }
    // Add more education entries as needed
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
    // Add more experience entries as needed
  ],
  skills: {
    technical: ["Python", "JavaScript", "React", "Next.js", "Java", "C", "HTML/CSS", "Data Science", "Git"],
    soft: ["Problem Solving", "Communication", "Team Leadership", "Project Management", "Attention to Detail"]
  },
  certifications: [
    {
      id: 1,
      name: "Full-Stack Web Development",
      issuer: "University of Maryland",
      date: "2023"
    }
    // Add any certifications you have
  ]
};

const ResumeSection = () => {
  // Animation variants for staggered reveal
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
  
  return (
    <section className={styles.resumeSection} id="resume">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Resume & Experience</h2>
          <p className={styles.sectionDescription}>
            My academic background, professional experience, and skill set.
          </p>
          
          <motion.a 
            href="/resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.downloadButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Full Resume
          </motion.a>
        </div>
        
        <div className={styles.resumeContent}>
          {/* Education Section */}
          <motion.div 
            className={styles.resumeSection}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className={styles.resumeSectionTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              Education
            </h3>
            
            {resumeData.education.map((edu) => (
              <motion.div 
                key={edu.id} 
                className={styles.resumeItem}
                variants={itemVariants}
              >
                <div className={styles.resumeItemHeader}>
                  <h4 className={styles.resumeItemTitle}>{edu.degree}</h4>
                  <span className={styles.resumeItemPeriod}>{edu.period}</span>
                </div>
                <p className={styles.resumeItemSubtitle}>{edu.institution}, {edu.location}</p>
                <p className={styles.resumeItemDescription}>{edu.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Experience Section */}
          <motion.div 
            className={styles.resumeSection}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className={styles.resumeSectionTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Professional Experience
            </h3>
            
            {resumeData.experience.map((exp) => (
              <motion.div 
                key={exp.id} 
                className={styles.resumeItem}
                variants={itemVariants}
              >
                <div className={styles.resumeItemHeader}>
                  <h4 className={styles.resumeItemTitle}>{exp.role}</h4>
                  <span className={styles.resumeItemPeriod}>{exp.period}</span>
                </div>
                <p className={styles.resumeItemSubtitle}>{exp.company}, {exp.location}</p>
                <ul className={styles.resumeItemResponsibilities}>
                  {exp.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Skills Section */}
          <motion.div 
            className={`${styles.resumeSection} ${styles.skillsSection}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className={styles.resumeSectionTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              </svg>
              Skills
            </h3>
            
            <motion.div 
              className={styles.skillsContainer}
              variants={itemVariants}
            >
              <div className={styles.skillCategory}>
                <h4 className={styles.skillCategoryTitle}>Technical Skills</h4>
                <div className={styles.skillTags}>
                  {resumeData.skills.technical.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className={styles.skillCategory}>
                <h4 className={styles.skillCategoryTitle}>Soft Skills</h4>
                <div className={styles.skillTags}>
                  {resumeData.skills.soft.map((skill, index) => (
                    <span key={index} className={`${styles.skillTag} ${styles.softSkill}`}>{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Certifications Section */}
          {resumeData.certifications.length > 0 && (
            <motion.div 
              className={styles.resumeSection}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className={styles.resumeSectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="5" width="16" height="16" rx="2"></rect>
                  <path d="M16 2v4"></path>
                  <path d="M8 2v4"></path>
                  <path d="M16 12h-8"></path>
                  <path d="M12 16V8"></path>
                </svg>
                Certifications
              </h3>
              
              {resumeData.certifications.map((cert) => (
                <motion.div 
                  key={cert.id} 
                  className={styles.resumeItem}
                  variants={itemVariants}
                >
                  <div className={styles.resumeItemHeader}>
                    <h4 className={styles.resumeItemTitle}>{cert.name}</h4>
                    <span className={styles.resumeItemPeriod}>{cert.date}</span>
                  </div>
                  <p className={styles.resumeItemSubtitle}>{cert.issuer}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeGrid}></div>
      <div className={styles.decorativeBlur}></div>
    </section>
  );
};

export default ResumeSection;