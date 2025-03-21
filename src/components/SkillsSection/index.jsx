import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import styles from './SkillsSection.module.scss';

// Skill categories and items
const skillsData = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", icon: "python", color: "#3572A5" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "Java", icon: "java", color: "#B07219" },
      { name: "C", icon: "c", color: "#555555" },
      { name: "HTML", icon: "html", color: "#E34F26" },
      { name: "CSS", icon: "css", color: "#264DE4" }
    ]
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Next.js", icon: "nextjs", color: "#000000" },
      { name: "Node.js", icon: "nodejs", color: "#339933" },
      { name: "Express", icon: "express", color: "#000000" },
      { name: "Data Science", icon: "data", color: "#4169E1" }
    ]
  },
  {
    category: "Tools & Methodologies",
    skills: [
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "Agile/Scrum", icon: "agile", color: "#6DB33F" },
      { name: "UI/UX Design", icon: "uiux", color: "#FF7F50" },
      { name: "OOP", icon: "oop", color: "#8A2BE2" },
      { name: "GitHub", icon: "github", color: "#4078C0" }
    ]
  }
];

// 3D Interactive Cube Component
const SkillCube = ({ skill, index }) => {
  const controls = useAnimation();
  const cubeRef = useRef(null);
  
  // Motion values for interactive rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  
  
  // Auto-rotation animation
  useEffect(() => {
    let timeoutId;
    
    const startAnimation = () => {
      controls.start({
        rotateX: [0, 360],
        rotateY: [0, 360],
        transition: { 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "loop" 
        }
      });
    };
    
    // Start auto-rotation after a delay based on index
    timeoutId = setTimeout(() => {
      startAnimation();
    }, index * 100);
    
    return () => {
      clearTimeout(timeoutId);
      controls.stop();
    };
  }, [controls, index]);
  
  // Stop animation on interaction and resume after
  const handleHoverStart = () => {
    controls.stop();
  };
  
  const handleHoverEnd = () => {
    controls.start({
      rotateX: [rotateX.get(), rotateX.get() + 360],
      rotateY: [rotateY.get(), rotateY.get() + 360],
      transition: { 
        duration: 20, 
        ease: "linear", 
        repeat: Infinity,
        repeatType: "loop" 
      }
    });
  };
  
  // Handle mouse down for custom rotation
  const handleMouseDown = (e) => {
    e.preventDefault();
    
    const cube = cubeRef.current;
    if (!cube) return;
    
    controls.stop();
    
    // Initial position
    const startX = e.clientX;
    const startY = e.clientY;
    const initialRotateX = rotateX.get();
    const initialRotateY = rotateY.get();
    
    // Mouse move handler
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      rotateX.set(initialRotateX + deltaY * 0.5);
      rotateY.set(initialRotateY - deltaX * 0.5);
    };
    
    // Mouse up handler
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Resume auto-rotation after release
      controls.start({
        rotateX: [rotateX.get(), rotateX.get() + 360],
        rotateY: [rotateY.get(), rotateY.get() + 360],
        transition: { 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "loop" 
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={styles.cubeContainer}>
      <motion.div
        ref={cubeRef}
        className={styles.cube}
        style={{ 
          rotateX,
          rotateY,
          rotateZ,
          backgroundColor: skill.color + "22" // Adding transparency
        }}
        whileHover={{ scale: 1.1 }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onMouseDown={handleMouseDown}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { delay: index * 0.1, duration: 0.5 }
        }}
      >
        {/* Cube Faces */}
        <div className={`${styles.face} ${styles.front}`} style={{ borderColor: skill.color }}>
          <div className={styles.faceContent}>
            <div className={styles.skillIcon}>{IconComponents[skill.icon]}</div>
            <div className={styles.skillName}>{skill.name}</div>
          </div>
        </div>
        <div className={`${styles.face} ${styles.back}`} style={{ borderColor: skill.color }}>
          <div className={styles.faceContent}>
            <div className={styles.skillIcon}>{IconComponents[skill.icon]}</div>
            <div className={styles.skillName}>{skill.name}</div>
          </div>
        </div>
        <div className={`${styles.face} ${styles.left}`} style={{ borderColor: skill.color }}>
          <div className={styles.faceContent}>
            <div className={styles.skillIcon}>{IconComponents[skill.icon]}</div>
          </div>
        </div>
        <div className={`${styles.face} ${styles.right}`} style={{ borderColor: skill.color }}>
          <div className={styles.faceContent}>
            <div className={styles.skillIcon}>{IconComponents[skill.icon]}</div>
          </div>
        </div>
        <div className={`${styles.face} ${styles.top}`} style={{ borderColor: skill.color }}>
          <div className={styles.faceContent}>
            <div className={styles.skillIcon}>{IconComponents[skill.icon]}</div>
          </div>
        </div>
        <div className={`${styles.face} ${styles.bottom}`} style={{ borderColor: skill.color }}>
          <div className={styles.faceContent}>
            <div className={styles.skillIcon}>{IconComponents[skill.icon]}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isDisabled3D, setIsDisabled3D] = useState(true);
  const sectionRef = useRef(null);
  
  // Toggle 3D effects (simplified rotation when disabled)
  const toggle3DEffects = () => {
    setIsDisabled3D(!isDisabled3D);
  };
  
  return (
    <section ref={sectionRef} className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Technical Skills</h2>
          <p className={styles.sectionDescription}>
            A showcase of my technical toolkit and expertise
          </p>
          
          <button 
            className={styles.effectsToggle}
            onClick={toggle3DEffects}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            {isDisabled3D ? "Enable 3D Effects" : "Disable 3D Effects"}
          </button>
        </div>
        
        <div className={`${styles.skillsContainer} ${isDisabled3D ? styles.disabled3D : ''}`}>
          {/* Category tabs */}
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
          
          {/* Cubes display area */}
          <div className={styles.cubesWrapper}>
            {skillsData.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                className={styles.cubesContainer}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeCategory === catIndex ? 1 : 0,
                  display: activeCategory === catIndex ? 'grid' : 'none'
                }}
                transition={{ duration: 0.5 }}
              >
                {category.skills.map((skill, skillIndex) => (
                  <SkillCube 
                    key={skillIndex} 
                    skill={skill} 
                    index={skillIndex}
                    disabled3D={isDisabled3D}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.decorativeElement1}></div>
      <div className={styles.decorativeElement2}></div>
    </section>
  );
};

// Icon components for skills
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

export default SkillsSection;