import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './nav.module.scss';
import { menuSlide } from '../../animation';
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
    href: "/#work",
  },
  {
    title: "About",
    href: "/#about",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
  {
    title: "Instagram Analyzer",
    href: "/instagram-analyzer",
  },
];

export default function Nav({ onClose }) {
  const [selectedIndicator, setSelectedIndicator] = useState("/");

  const handleLinkClick = (href) => {
    setSelectedIndicator(href);
    if (onClose) {
      // Allow time for the navigation to register before closing the menu
      setTimeout(onClose, 300);
    }
  };

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
          onMouseLeave={() => setSelectedIndicator("/")} 
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
                setSelectedIndicator={handleLinkClick}
              />
            })
          }
        </div>
        <Footer />
      </div>
      <Curve />
    </motion.div>
  );
}