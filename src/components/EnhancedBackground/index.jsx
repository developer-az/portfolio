import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './EnhancedBackground.module.scss';

const EnhancedBackground = ({ color = "#121212" }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

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

    // Renderer setup with better performance options
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump'  // Use medium precision for better performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    // Store reference to container for cleanup
    const currentContainer = containerRef.current;
    
    // Store for use in cleanup function
    currentContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles - reduce count for better performance
    const particlesCount = window.innerWidth < 768 ? 200 : 350; // Reduce particles on mobile
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    // Fill positions with random values
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Use simpler material for better performance
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add minimal lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Simplified lines for better performance
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.03
    });
    
    const linesMesh = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      lineMaterial
    );
    scene.add(linesMesh);

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    
    // Throttled mouse move handler for performance
    let lastMoveTime = 0;
    const handleMouseMove = (event) => {
      const now = performance.now();
      if (now - lastMoveTime < 50) return; // Throttle to 20 updates per second
      lastMoveTime = now;
      
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Efficient window resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Optimize scroll handling
    let scrollY = 0;
    let lastScrollTime = 0;
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime < 100) return; // Throttle scroll updates
      lastScrollTime = now;
      
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Optimized connection update interval
    let lastUpdateTime = 0;
    
    // Animation loop with performance optimizations
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Reduce rotation speed for better performance
      particlesMesh.rotation.x += 0.0002;
      particlesMesh.rotation.y += 0.0001;
      
      // Add very subtle mouse interaction
      particlesMesh.rotation.x += mouseY * 0.0001;
      particlesMesh.rotation.y += mouseX * 0.0001;
      
      // Very subtle parallax effect on scroll
      particlesMesh.position.y = scrollY * 0.0002;

      // Update line connections periodically and less frequently for performance
      const now = performance.now();
      if (now - lastUpdateTime > 2000) { // Only update every 2 seconds
        updateConnections(particlesGeometry, linesMesh);
        lastUpdateTime = now;
      }

      renderer.render(scene, camera);
    };

    // Optimized function to update line connections between particles
    const updateConnections = (particlesGeometry, linesMesh) => {
      const positions = particlesGeometry.attributes.position.array;
      const vertices = [];
      const maxDistance = 5;
      // Limit connections to improve performance
      const maxConnectionsPerParticle = 2;
      
      // Use a more efficient algorithm to find connections
      for (let i = 0; i < positions.length; i += 3) {
        const x1 = positions[i];
        const y1 = positions[i + 1];
        const z1 = positions[i + 2];
        
        let connectionCount = 0;
        
        // Check only a subset of particles for connections, and limit the number of connections
        for (let j = i + 3; j < positions.length && connectionCount < maxConnectionsPerParticle; j += 9) {
          const x2 = positions[j];
          const y2 = positions[j + 1];
          const z2 = positions[j + 2];
          
          // Calculate squared distance (faster than using Math.sqrt)
          const distanceSquared = 
            (x2 - x1) * (x2 - x1) + 
            (y2 - y1) * (y2 - y1) + 
            (z2 - z1) * (z2 - z1);
          
          // Connect if close enough
          if (distanceSquared < maxDistance * maxDistance) {
            vertices.push(x1, y1, z1, x2, y2, z2);
            connectionCount++;
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
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
        if (currentContainer && currentContainer.contains(rendererRef.current.domElement)) {
          currentContainer.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={styles.enhancedBackground}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
};

export default EnhancedBackground;