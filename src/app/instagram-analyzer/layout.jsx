// src/app/instagram-analyzer/layout.jsx
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import InstagramAnalyzerNav from '@/components/InstagramAnalyzerNav';

export default function InstagramAnalyzerLayout({ children }) {
  const pathname = usePathname();
  const activeSection = pathname.split('/')[1] || '';

  return (
    <>
      <InstagramAnalyzerNav />
      {children}
    </>
  );
}