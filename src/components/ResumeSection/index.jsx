import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ResumeSection.module.scss';

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
    technical: ["Python", "JavaScript", "React", "Next.js", "Java", "C", "HTML/CSS", "Data Science", "Git", "SQL"],
    soft: ["Problem Solving", "Team Leadership", "Project Management", "Scrum", "Agile Development", "Public Speaking"]
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

// Timeline component - redesigned for better mobile experience
const TimelineItem = ({ year, title, subtitle, children, isRight = false }) => (
  <motion.div 
    className={`${styles.timelineItem} ${isRight ? styles.timelineRight : ''}`}
    variants={itemVariants}
  >
    <div className={styles.timelineMarker}>
      <div className={styles.timelineDot}></div>
      <div className={styles.timelineLine}></div>
    </div>
    
    <div className={styles.timelineDate}>
      <span>{year}</span>
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

const ResumeSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  return (
    <section ref={sectionRef} className={styles.resumeSection} id="resume">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleRow}>
            <motion.h2 
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              Resume
            </motion.h2>
            <span className={styles.designNumber}>Experience Timeline</span>
          </div>
          
          <motion.p 
            className={styles.sectionDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My academic background, professional experience, and skill set.
          </motion.p>
          
          <motion.div 
            className={styles.buttonContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a 
              href="/resume.pdf" 
              download="Anthony_Zhou_Resume.pdf"
              className={styles.downloadButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Full Resume
            </a>
          </motion.div>
        </div>
        
        <div className={styles.resumeContent}>
          {/* Timeline layout for education and experience */}
          <div className={styles.timeline}>
            <motion.div 
              className={styles.timelineWrapper}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className={styles.timelineSectionTitle}>
                <span className={styles.sectionIndicator}></span>
                Education
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
              
              <h3 className={styles.timelineSectionTitle}>
                <span className={styles.sectionIndicator}></span>
                Work Experience
              </h3>
              
              {/* Timeline for experience */}
              {resumeData.experience.map((exp, index) => (
                <TimelineItem
                  key={exp.id}
                  year={exp.period}
                  title={exp.role}
                  subtitle={`${exp.company}, ${exp.location}`}
                  isRight={index % 2 !== 0}
                >
                  <ul className={styles.responsibilities}>
                    {exp.responsibilities.map((responsibility, idx) => (
                      <li key={idx}>{responsibility}</li>
                    ))}
                  </ul>
                </TimelineItem>
              ))}
              
              {/* Certifications */}
              <h3 className={styles.timelineSectionTitle}>
                <span className={styles.sectionIndicator}></span>
                Certifications
              </h3>
              
              {resumeData.certifications.map((cert, index) => (
                <TimelineItem
                  key={cert.id}
                  year={cert.date}
                  title={cert.name}
                  subtitle={cert.issuer}
                  isRight={index % 2 !== 0}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Skills Section */}
          <motion.div 
            className={styles.skillsSection}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className={styles.resumeSectionTitle}>
              <span className={styles.sectionIndicator}></span>
              Additional Skills
            </h3>
            
            <div className={styles.skillsContainer}>
              <motion.div 
                className={styles.skillCategory}
                variants={itemVariants}
              >
                <h4 className={styles.skillCategoryTitle}>Technical Skills</h4>
                <div className={styles.skillTags}>
                  {resumeData.skills.technical.map((skill, index) => (
                    <motion.div 
                      key={index} 
                      className={styles.skillTag}
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className={styles.skillCategory}
                variants={itemVariants}
              >
                <h4 className={styles.skillCategoryTitle}>Soft Skills</h4>
                <div className={styles.skillTags}>
                  {resumeData.skills.soft.map((skill, index) => (
                    <motion.div 
                      key={index} 
                      className={`${styles.skillTag} ${styles.softSkill}`}
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.designElements}>
        <div className={styles.designGrid}></div>
        <div className={styles.designCircle1}></div>
        <div className={styles.designCircle2}></div>
      </div>
    </section>
  );
};

export default ResumeSection;