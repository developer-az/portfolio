import React, { useState } from 'react'
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { menuSlide } from '../animation';
import Link from './Link';
import Curve from './Curve';
import Footer from './Footer';

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Work",
    href: "/work",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
]

export default function index() {
  // Add missing state variable
  const [selectedIndicator, setSelectedIndicator] = useState("/");

  // Initialize selectedIndicator based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path) {
      setSelectedIndicator(path);
    }
  }, []);

  return (
    <motion.div 
      variants={menuSlide} 
      initial="initial" 
      animate="enter" 
      exit="exit" 
      className={styles.menu}
      >
       <div className={styles.body}>
            <div 
              onMouseLeave={() => { /* Optional: reset to current path */ }} 
              className={styles.nav}
            >
                    <div className={styles.header}>
                        <p>Navigation</p>
                    </div>
                    {
                      navItems.map((data, index) => {
                        return <Link 
                        key={index} 
                        data={{...data, index}} 
                        isActive={selectedIndicator === data.href} 
                        setSelectedIndicator={setSelectedIndicator}>
                        </Link>
                      })
                    }
            </div>
            <Footer />
        </div>
        <Curve />
    </motion.div>
  )
}