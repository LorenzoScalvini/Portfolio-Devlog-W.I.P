// BalatroCard.jsx
import React, { useState, useRef } from 'react';
import styles from './BalatroCard.module.css';
import balatroCard from "../../assets/balatrocard/Lucky.png";

const LuckyImage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 });
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <div 
          className={styles.card}
          ref={imageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            '--x': 0,
            '--y': 0,
            '--r': '0deg',
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`,
          }}
        >
          <img 
            src={balatroCard} 
            alt="Lucky Balatro Card" 
            className={styles.luckyImage}
          />
          <div className={styles.rainbowOverlay}></div>
          <div 
            className={styles.cursorEffect}
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
            }}
          ></div>
          <s></s>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <i key={i}></i>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LuckyImage;