'use client';

import styles from './style.module.scss';
import { AnimatePresence } from 'framer-motion';
import Nav from './nav';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Rounded from '../../common/RoundedButton';
import Magnetic from '../../common/Magnetic';
import { useState, useEffect, useRef } from 'react';

// Renamed from 'index' to 'Header' to follow React component naming conventions
export default function Header() {
  const [isActive, setIsActive] = useState(false);
  const header = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    // Your existing effect code
  }, []);

  return (
    <>
      <div ref={header} className={styles.header}>
        <div className={styles.logo}>
          <p className={styles.copyright}>©</p>
          <div className={styles.name}>
            <p className={styles.codeBy}>Code by</p>
            <p className={styles.dennis}>Dennis</p>
            <p className={styles.snellenberg}>Snellenberg</p>
          </div>
        </div>
        <div className={styles.nav}>
          <Magnetic>
            <div className={styles.el}>
              <a>Work</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a>About</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a>Contact</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
        </div>
      </div>
      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded onClick={() => {setIsActive(!isActive)}} className={`${styles.button}`}>
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </Rounded>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <Nav />}
      </AnimatePresence>
    </>
  )
}