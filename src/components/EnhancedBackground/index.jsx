import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './EnhancedBackground.module.scss';

const EnhancedBackground = ({ color = "#121212" }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    // Fill positions with random values
    for (let i = 0; i < particlesCount * 3; i++) {
      // Create wider distribution, concentrated toward center
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material with custom shaders for more professional look
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // Add directional light for more dimension
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Lines connecting nearby particles
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.05
    });
    
    // Create empty line mesh for later use
    const linesMesh = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      lineMaterial
    );
    scene.add(linesMesh);

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Scroll parallax effect
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Animation loop
    let frame = 0;
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      frame += 0.01;

      // Rotate particle system slightly based on mouse position
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0003;
      
      // Add subtle mouse interaction
      particlesMesh.rotation.x += mouseY * 0.0002;
      particlesMesh.rotation.y += mouseX * 0.0002;
      
      // Subtle parallax effect on scroll
      particlesMesh.position.y = scrollY * 0.0005;

      // Update line connections periodically (less frequently for performance)
      if (frame % 5 < 0.1) {
        updateConnections(particlesGeometry, linesMesh);
      }

      renderer.render(scene, camera);
    };

    // Function to update line connections between particles
    const updateConnections = (particlesGeometry, linesMesh) => {
      const positions = particlesGeometry.attributes.position.array;
      const vertices = [];
      const maxDistance = 5; // Maximum distance for connection
      
      // Check distances between particles
      for (let i = 0; i < positions.length; i += 3) {
        const x1 = positions[i];
        const y1 = positions[i + 1];
        const z1 = positions[i + 2];
        
        for (let j = i + 3; j < positions.length; j += 3) {
          const x2 = positions[j];
          const y2 = positions[j + 1];
          const z2 = positions[j + 2];
          
          // Calculate distance
          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + 
            Math.pow(y2 - y1, 2) + 
            Math.pow(z2 - z1, 2)
          );
          
          // Connect if close enough
          if (distance < maxDistance) {
            vertices.push(x1, y1, z1, x2, y2, z2);
          }
        }
      }
      
      // Update line geometry
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      linesMesh.geometry.dispose();
      linesMesh.geometry = lineGeometry;
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      scene.remove(particlesMesh);
      scene.remove(linesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      lineMaterial.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={styles.enhancedBackground}
      style={{ backgroundColor: color }}
    />
  );
};

export default EnhancedBackground;