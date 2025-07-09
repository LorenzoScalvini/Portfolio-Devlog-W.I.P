import React from 'react';
import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={styles.scrollToTop}
      onClick={scrollToTop}
      aria-label="Torna in cima"
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
