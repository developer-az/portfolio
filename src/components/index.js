// src/components/index.js
// Enhanced components index with better organization and lazy loading support

// Core components
export { default as Preloader } from './Preloader';
export { default as Header } from './Header';
export { default as AnimatedBackground } from './AnimatedBackground';
export { default as EnhancedBackground } from './EnhancedBackground';
export { default as FloatingNav } from './FloatingNav';

// Profile sections - grouped for easier imports
export { default as ProfileSection } from './ProfileSection';
export { default as WorkSection } from './WorkSection';
export { default as ContactSection } from './ContactSection';
export { default as ResumeSection } from './ResumeSection';
export { default as SkillsSection } from './SkillsSection';

// Project components
export { default as ProjectCard } from './ProjectCard';
export { default as ProjectDetailModal } from './WorkSection/ProjectDetailModal';

// Instagram Analyzer components - grouped for modular loading
export { default as InstagramAnalyzer } from './InstagramAnalyzer';

// Common UI components
export { default as RoundedButton } from '../common/RoundedButton';
export { default as Magnetic } from '../common/Magnetic';