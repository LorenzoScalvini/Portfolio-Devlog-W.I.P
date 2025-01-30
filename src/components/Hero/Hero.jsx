import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import heroImage from '../../assets/devIcon.png';

export default function Hero() {
  const navigate = useNavigate();

  const handleGoToAbout = () => {
    navigate('/portfolio');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>LORENZO SCALVINI</h1>
          <p>
            Full Stack Web Developer con React e Vanilla JS,
            <br /> focalizzato su soluzioni scalabili e performanti.
            <br /> Sviluppo frontend e backend con attenzione
            all’ottimizzazione.
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={handleGoToAbout}
              className={`${styles.btn} ${styles.primary}`}
            >
              MY PROJECTS
            </button>
          </div>
        </div>
        <img src={heroImage} alt="Hero Image" className={styles.heroImage} />
      </div>
    </div>
  );
}
