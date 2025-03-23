// src/app/instagram-analyzer/layout.jsx
'use client';


import FloatingNav from '@/components/FloatingNav';
import { useState, useEffect } from 'react';

export default function AnalyzerLayout({ children }) {
  const [activeSection, setActiveSection] = useState("");
  
  return (
    <>
      <FloatingNav activeSection={activeSection} />
      {children}
    </>
  );
}