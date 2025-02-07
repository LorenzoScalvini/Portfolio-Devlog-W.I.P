import React, { useEffect, useState } from 'react';
import styles from './CustomCursor.module.css';

const TRAIL_COUNT = 8; // Numero di elementi della scia

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPositions, setTrailPositions] = useState(
    new Array(TRAIL_COUNT).fill({ x: 0, y: 0 })
  );
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);

  // Aggiorna la posizione del cursore
  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleVisibilityChange = () => {
      setVisible(!document.hidden);
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Gestisce l'hover sugli elementi interattivi
  useEffect(() => {
    const addHover = () => setHovered(true);
    const removeHover = () => setHovered(false);

    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.querySelectorAll('a, button, input, textarea').forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  // Aggiorna la scia del cursore
  useEffect(() => {
    const updateTrail = () => {
      setTrailPositions((prev) => {
        const newPositions = [...prev];
        newPositions.pop();
        newPositions.unshift({ x: position.x, y: position.y });
        return newPositions;
      });

      requestAnimationFrame(updateTrail);
    };

    requestAnimationFrame(updateTrail);
  }, [position]);

  return (
    <>
      {/* Scia del cursore */}
      {trailPositions.map((pos, index) => (
        <div
          key={index}
          className={`${styles.trail} ${!visible ? styles.hidden : ''}`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: 1 - index / TRAIL_COUNT, // Sfuma la scia
          }}
        />
      ))}
      {/* Cursore principale */}
      <div
        className={`${styles.customCursor} ${hovered ? styles.hover : ''} ${
          !visible ? styles.hidden : ''
        }`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};

export default CustomCursor;
