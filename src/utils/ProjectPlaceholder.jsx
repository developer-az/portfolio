import React from 'react';

/**
 * Custom utility component that generates SVG-based placeholder images for projects
 * This avoids the 404 errors when GIFs are missing
 */
const generateProjectPlaceholder = (project) => {
  const projectId = project.id;
  const title = project.title;
  const firstLetter = title.charAt(0);
  
  // Generate a deterministic color based on project ID
  const hue = ((projectId * 137) % 360); // Use prime number for better distribution
  const saturation = 70 + (projectId * 13) % 30; // Between 70-100%
  const lightness = 45 + (projectId * 7) % 15; // Between 45-60%
  
  // Create color for background and accent
  const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const accentColor = `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness + 20}%)`;
  
  // Create an SVG-based placeholder
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
      <rect width="400" height="225" fill="${bgColor}" />
      <circle cx="200" cy="112.5" r="70" fill="${accentColor}" opacity="0.3" />
      <text x="200" y="125" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">${firstLetter}</text>
      <text x="200" y="175" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">${title}</text>
    </svg>
  `;
  
  // Convert SVG to a data URL
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  return URL.createObjectURL(svgBlob);
};

// Component to render a project placeholder
const ProjectPlaceholder = ({ project }) => {
  const placeholderUrl = generateProjectPlaceholder(project);
  
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundImage: `url(${placeholderUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  );
};

export default ProjectPlaceholder;
export { generateProjectPlaceholder };