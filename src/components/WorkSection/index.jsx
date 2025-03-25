import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ProjectCard from '../ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import styles from './WorkSection.module.scss';

// Project data with complete details
const projects = [
  {
    id: 1,
    title: "Instagram Analyzer",
    description: "A privacy-focused tool that helps users identify who isn't following them back on Instagram without uploading any data to servers.",
    longDescription: "This client-side application was built with privacy as the top priority. It processes Instagram data entirely in the browser to identify users who don't follow you back. The tool never uploads user data to any server, ensuring complete data privacy and security while providing valuable social media analytics.",
    technologies: ["Next.js", "React", "JavaScript", "Client-side Processing"],
    image: "/images/projects/instagram-analyzer.jpg",
    gif: "/images/projects/1.gif",
    demoLink: "/instagram-analyzer",
    repoLink: "https://github.com/developer-az/instagram-analyzer",
    category: "web",
    features: [
      "Complete client-side processing for ultimate privacy",
      "Clean, intuitive UI with dark mode support",
      "Detailed analytics with user counts and statistics",
      "Interactive user list with profile links"
    ]
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Modern portfolio featuring fluid animations, responsive design, and theme toggling capabilities.",
    longDescription: "A performance-optimized Next.js-based portfolio showcasing my projects and skills. Features include smooth animations with Framer Motion, responsive design for all devices, theme switching capabilities, and dynamic content sections. Built with accessibility and SEO best practices in mind.",
    technologies: ["Next.js", "Framer Motion", "SCSS", "Responsive Design"],
    image: "/images/projects/portfolio.jpg",
    gif: "/images/projects/2.gif",
    demoLink: "/",
    repoLink: "https://github.com/developer-az/portfolio",
    category: "web",
    features: [
      "Smooth page transitions and scroll animations",
      "Dark/light theme toggle with system preference detection",
      "Interactive project cards with 3D effects",
      "Fully responsive across all device sizes",
      "Optimized images and lazy loading for performance"
    ]
  },
  {
    id: 3,
    title: "Financial Dashboard",
    description: "Interactive dashboard for visualizing and analyzing financial market data with customizable chart components.",
    longDescription: "A comprehensive financial data visualization platform featuring real-time market data, customizable charts, and technical indicators. Users can track stocks, cryptocurrencies, and other assets with personalized watchlists and receive market alerts based on custom parameters.",
    technologies: ["React", "D3.js", "Material UI", "Financial APIs"],
    image: "/images/projects/finance.jpg",
    gif: "/images/projects/3.gif",
    demoLink: "https://finance-dashboard-demo.vercel.app",
    repoLink: "https://github.com/developer-az/finance-dashboard",
    category: "data",
    features: [
      "Real-time financial data visualization",
      "Interactive charts with zoom, pan, and tooltip functionality",
      "Customizable technical indicators",
      "Portfolio performance tracking",
      "Market alerts and notifications"
    ]
  },
  {
    id: 4,
    title: "ML Text Classifier",
    description: "Natural language processing application that classifies text using machine learning algorithms with high accuracy.",
    longDescription: "An advanced NLP application that leverages machine learning to classify text into predefined categories. The system uses a combination of TensorFlow models and pre-trained language models to achieve high accuracy. Features include multi-language support, sentiment analysis, and custom category training.",
    technologies: ["Python", "TensorFlow", "NLP", "Machine Learning"],
    image: "/images/projects/ml.jpg",
    gif: "/images/projects/4.gif",
    demoLink: "https://ml-text-classifier-demo.vercel.app",
    repoLink: "https://github.com/developer-az/ml-text-classifier",
    category: "ml",
    features: [
      "Multi-language support for text classification",
      "High-accuracy sentiment analysis",
      "Custom category training for specialized applications",
      "Exportable models for offline use",
      "Batch processing capabilities for large datasets"
    ]
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
  }
};

const WorkSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  // Filter projects when active category changes
  useEffect(() => {
    setFilteredProjects(
      activeFilter === "all"
        ? projects
        : projects.filter(project => project.category === activeFilter)
    );
  }, [activeFilter]);

  // Reveal animation effect
  useEffect(() => {
    if (isInView && !isRevealed) {
      setIsRevealed(true);
    }
  }, [isInView, isRevealed]);

  // Project detail functions
  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.classList.add('modal-open');
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.classList.remove('modal-open');
  };

  return (
    <section ref={sectionRef} className={styles.workSection} id="work">
      <div className={styles.yslBackground}>
        <div className={styles.goldAccent}></div>
      </div>
      
      <div className={styles.container}>
        {/* YSL-inspired luxury header */}
        <div className={styles.luxuryHeader}>
          <motion.div
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className={styles.sectionTitle} ref={titleRef}>
              <span className={styles.titleLine}></span>
              <span className={styles.titleText}>MY PROJECTS</span>
              <span className={styles.titleLine}></span>
            </h2>
            <motion.p 
              className={styles.sectionDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              CURATED COLLECTION
            </motion.p>
          </motion.div>

          {/* Luxury Filter Buttons */}
          <motion.div 
            className={styles.categoryFilters}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`${styles.filterButton} ${
                  activeFilter === category.id ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={isInView ? 
                  { opacity: 1, transition: { delay: 0.1 + index * 0.1 } } : 
                  { opacity: 0 }
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
          </motion.div>
        </div>

        {/* Project Showcase Grid */}
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
                  layout
                  variants={cardVariants}
                  exit="exit"
                  initial="hidden"
                  animate="visible"
                  className={styles.projectCardWrapper}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    imageSrc={project.gif || project.image}
                    demoLink={project.demoLink}
                    repoLink={project.repoLink}
                    technologies={project.technologies}
                    onClick={() => openProjectModal(project)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Luxury Footer Element */}
        <motion.div
          className={styles.collectionSummary}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className={styles.summaryDivider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerSymbol}>GITHUB</span>
            <span className={styles.dividerLine}></span>
          </div>
          <motion.p className={styles.summaryText}>
            {filteredProjects.length} {filteredProjects.length === 1 ? 'PIECE' : 'PIECES'} IN THE COLLECTION
            {activeFilter !== "all" &&
              ` • ${categories.find((cat) => cat.id === activeFilter)?.name.toUpperCase()}`}
          </motion.p>
          <motion.a
            href="https://github.com/developer-az"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewMoreLink}
            whileHover={{ x: 5 }}
          >
            <span>VIEW COMPLETE COLLECTION</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Decorative YSL Elements */}
      <div className={styles.yslDecorativeElement1}></div>
      <div className={styles.yslDecorativeElement2}></div>
      <div className={styles.yslLogo}></div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal 
            project={selectedProject} 
            onClose={closeProjectModal} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default React.memo(WorkSection);