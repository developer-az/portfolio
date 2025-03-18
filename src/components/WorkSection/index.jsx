import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WorkSection.module.scss';

// Project data
const projects = [
    {
      id: 1,
      title: "Instagram Analyzer",
      description: "Identify your Instagram unfollowers.",
      technologies: ["Next.js", "React", "JavaScript", "Data Analysis"],
      image: "/images/projects/1.gif",
      demoLink: "/instagram-analyzer",
      repoLink: "https://github.com/developer-az/instagram-analyzer",
      category: "web",
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "Interactive personal portfolio.",
      technologies: ["Next.js", "Framer Motion", "JavaScript"],
      image: "/images/projects/2.gif",
      demoLink: "/",
      repoLink: "https://github.com/developer-az/portfolio",
      category: "web",
    },
    {
      id: 3,
      title: "Financial Data Visualization",
      description: "Real-time financial data visualization dashboard.",
      technologies: ["React", "D3.js", "JavaScript"],
      image: "/images/projects/3.gif",
      demoLink: "#",
      repoLink: "https://github.com/developer-az/finance-dashboard",
      category: "data",
    },
    {
      id: 4,
      title: "Machine Learning Text Classifier",
      description: "NLP-based text classifier built with Python and TensorFlow.",
      technologies: ["Python", "TensorFlow", "NLP", "ML"],
      image: "/images/projects/4.gif",
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

// Framer Motion variants for the grid container and cards
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9 },
};

const WorkSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section className={styles.workSection} id="work">
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>Selected Work</h2>
          <p className={styles.sectionDescription}>
            Explore my latest projects showcasing modern design and advanced
            techniques.
          </p>

          {/* Filter Buttons */}
          <div className={styles.projectFilters}>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`${styles.filterButton} ${
                  activeFilter === category.id ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
                {activeFilter === category.id && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className={styles.projectsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className={styles.projectCard}
                variants={cardVariants}
                layout
                exit="exit"
                whileHover={{
                  scale: 1.03,
                  zIndex: 1,
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.projectImageContainer}>
                  {project.image ? (
                    <div
                      className={styles.projectImage}
                      style={{
                        backgroundImage: `url(${project.image})`,
                      }}
                    />
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
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>

                  <div className={styles.projectLinks}>
                    {project.demoLink && (
                      <motion.a
                        href={project.demoLink}
                        className={styles.projectLink}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Demo
                      </motion.a>
                    )}

                    {project.repoLink && (
                      <motion.a
                        href={project.repoLink}
                        className={`${styles.projectLink} ${styles.githubLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Code
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Count Summary */}
        <motion.div
          className={styles.projectSummary}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p>
            Showing {filteredProjects.length} of {projects.length} projects
            {activeFilter !== "all" &&
              ` in ${
                categories.find((cat) => cat.id === activeFilter)?.name
              }`}
          </p>
          <motion.a
            href="https://github.com/developer-az"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubProfileLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects on GitHub
          </motion.a>
        </motion.div>
      </div>

      {/* Decorative elements (if needed) */}
      <div className={styles.decorativeElement1}></div>
      <div className={styles.decorativeElement2}></div>
    </section>
  );
};

export default WorkSection;
