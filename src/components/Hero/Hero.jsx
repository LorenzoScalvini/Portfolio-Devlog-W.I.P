import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

import githubLogo from "../../assets/Logos/GithubLogo.svg";
import profilePhoto from "../../assets/images/profile-photo.jpg";
import bgVideo from "../../assets/videos/background.mp4"; 

const heroTexts = {
  subtitle: "Full-Stack Developer | Programmatore",
  title: "LORENZO SCALVINI",
  description:
    "Full Stack Web Developer specializzato in React e Vanilla JS o Typescript",
  buttonProjects: "Progetti",
  buttonAbout: "Contattami",
  buttonGithub: "Github",
  githubUrl: "https://github.com/LorenzoScalvini",
};

export default function Hero() {
  const navigate = useNavigate();

  const handleGoToProjects = () => {
    navigate("/projects");
  };

  const handleGoToAbout = () => {
    navigate("/contacts");
  };

  const handleGoToGitHub = () => {
    window.open(heroTexts.githubUrl, "_blank");
  };

  return (
    <section className={styles.heroSection}>
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className={styles.backgroundVideo}
      >
        <source src={bgVideo}/>
        Your browser does not support the video tag.
      </video>

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span className={styles.subtitle}>{heroTexts.subtitle}</span>
          <h1 className={styles.title}>{heroTexts.title}</h1>

          <div className={styles.description}>
            <p>{heroTexts.description}</p>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={handleGoToProjects}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {heroTexts.buttonProjects}
              <span className={styles.arrow}>→</span>
            </button>

            <button
              onClick={handleGoToAbout}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {heroTexts.buttonAbout}
              <span className={styles.arrow}>→</span>
            </button>

            <button
              onClick={handleGoToGitHub}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              <img src={githubLogo} alt="GitHub" className={styles.icon} />
              {heroTexts.buttonGithub}
            </button>
          </div>
        </div>

        {/* Aggiunta della foto floating */}
        <div className={styles.floatingPhotoContainer}>
          <img 
            src={profilePhoto} 
            alt="Lorenzo Scalvini" 
            className={styles.floatingPhoto}
          />
        </div>
      </div>
    </section>
  );
}