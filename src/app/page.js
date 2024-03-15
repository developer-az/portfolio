'use client'
import styles from './page.module.scss'
import { useState } from 'react';  
import { AnimatePresence,motion, useInView, useAnimation } from 'framer-motion';
import useMousePosition from './utils/useMousePosition';
import { useEffect, useRef } from 'react';
import Preloader from '../components/Preloader';





export default function Home() {








    const [isLoading, setIsLoading] = useState(true);
  
    useEffect( () => {
      (
        async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default
            const locomotiveScroll = new LocomotiveScroll();
  
            setTimeout( () => {
              setIsLoading(false);
              document.body.style.cursor = 'default'
              window.scrollTo(0,0);
            }, 2000);
            
        }
      )()
    }, [])
  
    



  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  return (
    
    <main className={styles.main}>
      
    <AnimatePresence mode='wait'>
          {isLoading && <Preloader />}
        </AnimatePresence>
      <motion.div 
        className={styles.mask}
        animate={{
          WebkitMaskPosition: `${x - (size/2)}px ${y - (size/2)}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration:0.5}}
      >
          <p onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}>
          你好我是周嘉成.
          </p>
      </motion.div>

      <div className={styles.body}>
        <p>Hello, I am <span>Anthony Zhou</span> .</p>
      </div>

    </main>
  )
}
