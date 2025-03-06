import React from 'react';
import styles from './RoundedButton.module.scss';
import Magnetic from './Magnetic';

const RoundedButton = ({ children, onClick, className = '', magneticEffect = true }) => {
  const buttonContent = (
    <button 
      className={`${styles.roundedButton} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
  
  // Wrap with Magnetic component if magnetic effect is enabled
  if (magneticEffect) {
    return <Magnetic>{buttonContent}</Magnetic>;
  }
  
  return buttonContent;
};

export default RoundedButton;