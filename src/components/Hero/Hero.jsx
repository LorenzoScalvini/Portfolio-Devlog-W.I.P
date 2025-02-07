import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import heroImage from '../../assets/devIcon.jpg';

export default function Hero() {
  const navigate = useNavigate();

  const handleGoToAbout = () => {
    navigate('/portfolio');
  };

  const handleGoToGitHub = () => {
    window.open('https://github.com/LorenzoScalvini', '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>LORENZO SCALVINI</h1>
          <p className={styles.description}>
            Full Stack Web Developer con <strong>React</strong> e{' '}
            <strong>Vanilla JS</strong>,
            <br className={styles.desktopBreak} />
            focalizzato su soluzioni scalabili e performanti.
            <br className={styles.desktopBreak} />
            Sviluppo <strong>Frontend</strong> e <strong>Backend</strong> con
            attenzione all'ottimizzazione.
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={handleGoToAbout}
              className={`${styles.btn} ${styles.primary}`}
            >
              MY PROJECTS
            </button>
            <button
              onClick={handleGoToGitHub}
              className={`${styles.btn} ${styles.github}`}
            >
              GITHUB
            </button>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src={heroImage} alt="Hero Image" className={styles.heroImage} />
        </div>
      </div>
    </div>
  );
}
