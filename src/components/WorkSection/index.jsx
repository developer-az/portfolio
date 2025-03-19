import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './WorkSection.module.scss';

// Project data (expanded with more details)
const projects = [
  {
    id: 1,
    title: "Instagram Analyzer",
    description: "A privacy-focused tool that helps users identify who isn't following them back on Instagram. Uses client-side processing for complete privacy.",
    technologies: ["Next.js", "React", "JavaScript", "Data Analysis"],
    image: "/images/projects/instagram-analyzer.jpg",
    demoLink: "/instagram-analyzer",
    repoLink: "https://github.com/developer-az/instagram-analyzer",
    category: "web",
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Modern portfolio featuring fluid animations, responsive design, and theme toggling capabilities. Built with performance and accessibility in mind.",
    technologies: ["Next.js", "Framer Motion", "SCSS", "Responsive Design"],
    image: "/images/projects/portfolio.jpg",
    demoLink: "/",
    repoLink: "https://github.com/developer-az/portfolio",
    category: "web",
  },
  {
    id: 3,
    title: "Financial Dashboard",
    description: "Real-time financial data visualization dashboard with interactive charts and data filtering capabilities.",
    technologies: ["React", "D3.js", "Material UI", "Financial API"],
    image: "/images/projects/finance.jpg",
    demoLink: "#",
    repoLink: "https://github.com/developer-az/finance-dashboard",
    category: "data",
  },
  {
    id: 4,
    title: "ML Text Classifier",
    description: "Natural language processing application that classifies text using machine learning algorithms.",
    technologies: ["Python", "TensorFlow", "NLP", "ML"],
    image: "/images/projects/ml.jpg",
    demoLink: "#",
    repoLink: "https://github.com/developer-az/ml-text-classifier",
    category: "ml",
  },
];

// Project categories
const categories = [
  { id: "all", name: "All Projects" },
  { id: "web", name: "Web Development" },
  { id: "data", name: "Data Visualization" },
  { id: "ml", name: "Machine Learning" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

const WorkSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  // Filter projects when active category changes
  useEffect(() => {
    setFilteredProjects(
      activeFilter === "all"
        ? projects
        : projects.filter(project => project.category === activeFilter)
    );
  }, [activeFilter]);

  return (
    <section ref={sectionRef} className={styles.workSection} id="work">
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>Featured Work</h2>
          <p className={styles.sectionDescription}>
            Explore my latest projects showcasing modern design and technical expertise.
          </p>

          {/* Filter Buttons */}
          <div className={styles.projectFilters}>
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`${styles.filterButton} ${
                  activeFilter === category.id ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(category.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? 
                  { opacity: 1, y: 0, transition: { delay: 0.1 + index * 0.1 } } : 
                  { opacity: 0, y: 20 }
                }
              >
                {category.name}
                {activeFilter === category.id && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeFilterIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          <motion.div 
            className={styles.projectsContainer}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className={styles.projectCard}
                  variants={cardVariants}
                  layout
                  exit="exit"
                  whileHover="hover"
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.projectImageContainer}>
                    {project.image ? (
                      <>
                        <div
                          className={styles.projectImage}
                          style={{
                            backgroundImage: `url(${project.image})`,
                          }}
                        />
                        <motion.div 
                          className={styles.projectImageOverlay}
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className={styles.overlayContent}>
                            <h4>{project.title}</h4>
                            <p>View Project</p>
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <div className={styles.projectImagePlaceholder}>
                        {project.id.toString().padStart(2, "0")}
                      </div>
                    )}
                    <div className={styles.projectOverlay}>
                      <div className={styles.projectTech}>
                        {project.technologies.map((tech, index) => (
                          <span key={index} className={styles.techBadge}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.projectContent}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDescription}>{project.description}</p>

                    <div className={styles.projectLinks}>
                      {project.demoLink && (
                        <Link
                          href={project.demoLink}
                          className={styles.projectLink}
                        >
                          <span>Demo</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </Link>
                      )}

                      {project.repoLink && (
                        <a
                          href={project.repoLink}
                          className={`${styles.projectLink} ${styles.githubLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Code</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Project card shine effect */}
                  <div className={styles.cardShine} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* GitHub profile link */}
        <motion.div
          className={styles.projectSummary}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p>
            Showing {filteredProjects.length} of {projects.length} projects
            {activeFilter !== "all" &&
              ` in ${categories.find((cat) => cat.id === activeFilter)?.name}`}
          </p>
          <motion.a
            href="https://github.com/developer-az"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubProfileLink}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View More Projects on GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className={styles.decorativeElement1} />
      <div className={styles.decorativeElement2} />
    </section>
  );
};

export default WorkSection;