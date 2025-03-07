import styles from './style.module.scss';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';

export default function Index({data, isActive, setSelectedIndicator}) {
  const { title, href, index } = data;
  
  return (
    <motion.div 
      className={styles.link} 
      onMouseEnter={() => {setSelectedIndicator(href)}} 
      custom={index} 
      variants={slide} 
      initial="initial" 
      animate="enter" 
      exit="exit"
    >
      <motion.div 
        variants={scale} 
        animate={isActive ? "open" : "closed"} 
        className={styles.indicator}>
      </motion.div>
      <NextLink href={href}>{title}</NextLink>
    </motion.div>
  )
}