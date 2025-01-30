import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import heroImage from '../../assets/placeholder.png'; // Adjust the path to your image
import GitHubIcon from '../../assets/GitHubIcon.png'; // Import GitHub icon

export default function Hero() {
  const navigate = useNavigate();

  const handleGoToAbout = () => {
    navigate('/about');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>LORENZO SCALVINI</h1>
          <p>Discover the beauty of simplicity and elegance in every detail.</p>
          <div className={styles.heroButtons}>
            <button
              onClick={handleGoToAbout}
              className={`${styles.btn} ${styles.primary}`}
            >
              Watch my works
            </button>
            <button
              onClick={() =>
                (window.location.href = 'https://github.com/LorenzoScalvini')
              }
              className={`${styles.btn} ${styles.secondary}`}
            >
              <img src={GitHubIcon} alt="GitHub" className={styles.icon} />{' '}
              Github
            </button>
          </div>
        </div>
        <img src={heroImage} alt="Hero Image" className={styles.heroImage} />
      </div>
    </div>
  );
}
