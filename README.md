# Anthony Zhou Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-14.2.26-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.18.0-purple?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12.7-brightgreen?style=flat-square&logo=greensock)](https://greensock.com/gsap/)
[![Three.js](https://img.shields.io/badge/Three.js-0.156.1-black?style=flat-square&logo=three.js)](https://threejs.org/)

## Overview

This repository contains the source code for my personal portfolio website, showcasing my work, skills, and experience as a software engineer and web designer. The website features a modern, responsive design with smooth animations and interactive elements.

## Credits & Inspiration

This portfolio's landing page design and interactions were inspired by:

- **Original**: [Dennis Snellenberg](https://dennissnellenberg.com/) - Award-winning designer whose portfolio concept served as inspiration
- **Adaptation**: [Awwwards Landing Page](https://blog.olivierlarose.com/tutorials/awwwards-landing-page) by Olivier Larose (July 23, 2023) - The implementation approach for the interactive text reveal effect was adapted from this tutorial

## Features

- **Modern Design**: Clean, minimalist interface with a focus on content
- **Responsive Layout**: Optimized for all device sizes from mobile to desktop
- **Interactive Animations**: Smooth page transitions and micro-interactions using Framer Motion
- **Dynamic Content**: Showcases projects, skills, and experience in an engaging way
- **Performance Optimized**: Fast load times with code splitting and optimized assets
- **Dark Theme**: Elegant dark theme for improved readability and visual appeal
- **SEO Friendly**: Optimized metadata for better search engine visibility
- **Accessibility**: Built with accessibility considerations in mind

## Technologies

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **Framer Motion**: Library for powerful animations and transitions
- **SASS/SCSS**: Advanced styling with variables, nesting, and modules
- **Three.js**: 3D graphics in the browser for interactive background elements
- **GSAP**: Animation library for complex motion sequences

### Development
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Sharp**: Image optimization
- **Critters**: Critical CSS optimization

## Project Structure

```
├── public/             # Static assets, fonts, and images
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # React components organized by feature
│   ├── context/        # React context providers
│   ├── utils/          # Utility functions and hooks
│   └── common/         # Shared UI components
├── .eslintrc.js        # ESLint configuration
├── jsconfig.json       # JavaScript configuration
└── next.config.js      # Next.js configuration
```

## Key Components

- **Preloader**: Custom loading animation for initial page load
- **EnhancedBackground**: Interactive background with particles and gradients
- **FloatingNav**: Smooth navigation with scroll animations
- **ProfileSection**: Introduction and personal information
- **WorkSection**: Project showcase with filtering capabilities
- **SkillsSection**: Skills visualization with progress indicators
- **ContactSection**: Contact form with validation
- **Instagram Analyzer**: A specialized tool for Instagram analytics

## Development

This portfolio is built with modern web technologies and follows best practices for performance, accessibility, and user experience. The development environment requires Node.js 18.17.0+ and uses npm for package management.

The build process is optimized for production deployment with features such as:

- Code splitting for optimal loading performance
- Image optimization with Sharp
- Critical CSS extraction
- Comprehensive ESLint configuration

## Deployment

This project is configured for deployment on Vercel for optimal performance with Next.js. Automatic deployments are set up on the production branch.

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments on commits to the main branch.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved. This code is not open for contributions or available for use without explicit permission.

## Contact

- **Website**: [anthony-zhou.com](https://anthony-zhou.com)
- **Email**: azhou112@umd.edu
- **GitHub**: [@developer-az](https://github.com/developer-az)
- **LinkedIn**: [anthony--zhou](https://www.linkedin.com/in/anthony--zhou)

---

© 2025 Anthony Zhou. All Rights Reserved.