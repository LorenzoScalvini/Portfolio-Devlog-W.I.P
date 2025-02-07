import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import heroImage from '../../assets/Me/devIcon.jpg';

export default function Hero() {
  const navigate = useNavigate();

  const handleGoToAbout = () => {
    navigate('/projects');
  };

  const handleGoToGitHub = () => {
    window.open('https://github.com/LorenzoScalvini', '_blank');
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.glowBackground}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <span className={styles.subtitle}>Full Stack Developer</span>
            <h1 className={styles.title}>LORENZO SCALVINI</h1>

            <div className={styles.description}>
              <p>
                Full Stack Web Developer specializzato in <strong>React</strong>{' '}
                e <strong>Vanilla JS</strong>, con focus su soluzioni scalabili
                e performanti. Sviluppo <strong>Frontend</strong> e{' '}
                <strong>Backend</strong> con particolare attenzione
                all'ottimizzazione.
              </p>
            </div>

            <div className={styles.actionButtons}>
              <button
                onClick={handleGoToAbout}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                I Miei Progetti
                <span className={styles.arrow}>→</span>
              </button>

              <button
                onClick={handleGoToGitHub}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                GitHub
                <span className={styles.arrow}>→</span>
              </button>
            </div>
          </div>

          <div className={styles.imageWrapper}>
            <div className={styles.imageContainer}>
              <img src={heroImage} alt="Profile" className={styles.heroImage} />
              <div className={styles.imageGlow}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
