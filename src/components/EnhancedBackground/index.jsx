import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './EnhancedBackground.module.scss';

const EnhancedBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const particlesMeshRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup with better position
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;

    // Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: window.devicePixelRatio < 2, // Only use antialias for higher-end devices
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Responsive particle count based on device
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 150 : 300;
    
    // Optimize buffer geometry creation
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    // Fill positions with more interesting distribution
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a more artistic distribution with more particles in the center
      const radius = Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i+2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Optimized material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    // Create particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesMeshRef.current = particlesMesh;

    // Minimal ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Optimized connections with reduced updates
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

    // Throttled event handlers
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 200);
    };

    // Throttled scroll handler
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    // Event listeners with passive option for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Connection update manager
    let lastUpdateTime = 0;
    
    // Optimized connections generator
    const updateConnections = () => {
      const positions = particlesGeometry.attributes.position.array;
      const vertices = [];
      const maxDistance = 5;
      const maxConnections = 1; // Reduce for better performance
      
      // Optimize connection finding algorithm - only check every nth particle
      const step = isMobile ? 4 : 2; // Check fewer particles on mobile
      
      for (let i = 0; i < positions.length; i += 3 * step) {
        const x1 = positions[i];
        const y1 = positions[i + 1];
        const z1 = positions[i + 2];
        
        let connectionCount = 0;
        
        // Only check a subset of particles
        for (let j = i + 3 * step; j < positions.length && connectionCount < maxConnections; j += 3 * step) {
          const x2 = positions[j];
          const y2 = positions[j + 1];
          const z2 = positions[j + 2];
          
          // Calculate squared distance (faster than using Math.sqrt)
          const distanceSquared = 
            (x2 - x1) * (x2 - x1) + 
            (y2 - y1) * (y2 - y1) + 
            (z2 - z1) * (z2 - z1);
          
          if (distanceSquared < maxDistance * maxDistance) {
            vertices.push(x1, y1, z1, x2, y2, z2);
            connectionCount++;
          }
        }
      }
      
      // Update line geometry efficiently
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      linesMesh.geometry.dispose();
      linesMesh.geometry = lineGeometry;
    };

    // More efficient animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Apply subtle rotation
      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.x += 0.0002;
        particlesMeshRef.current.rotation.y += 0.0001;
        
        // Add minimal mouse interaction
        particlesMeshRef.current.rotation.x += mouseRef.current.y * 0.0001;
        particlesMeshRef.current.rotation.y += mouseRef.current.x * 0.0001;
        
        // Subtle scroll effect
        particlesMeshRef.current.position.y = scrollRef.current * 0.0001;
      }

      // Update connections only every 2 seconds for performance
      const now = performance.now();
      if (now - lastUpdateTime > 2000) {
        updateConnections();
        lastUpdateTime = now;
      }

      renderer.render(scene, camera);
    };

    // Start animation
    updateConnections();
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      // Dispose resources
      if (particlesMeshRef.current) {
        scene.remove(particlesMeshRef.current);
        particlesMeshRef.current.geometry.dispose();
        particlesMeshRef.current.material.dispose();
      }
      
      scene.remove(linesMesh);
      linesMesh.geometry.dispose();
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
      aria-hidden="true"
    />
  );
};

export default React.memo(EnhancedBackground);