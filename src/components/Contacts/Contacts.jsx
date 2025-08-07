import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contacts.module.css";
import githubLogo from "../../assets/Logos/GithubLogo.svg";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const contactTexts = {
  subtitle: "Disponibile per nuove opportunità",
  description:
    "Programmatore / Web Developer: realizzo soluzioni web moderne, accessibili e performanti con tecnologie come React, TypeScript e Tailwind. Competenze in UI/UX, integrazione API.",
  buttonProjects: "Progetti",
  buttonGithub: "Github",
  githubUrl: "https://github.com/LorenzoScalvini",
  email: "lorenzo.scalvini1704@gmail.com",
  phone: "+39 379 151 0526",
  contactTitle: "Contatti diretti"
};

export default function Contacts() {
  const navigate = useNavigate();

  const handleGoToGitHub = () => {
    window.open(contactTexts.githubUrl, "_blank");
  };

  const handleGoToProjects = () => {
    navigate("/projects");
  };

  return (
    <section className={styles.contactSection}>
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className={styles.backgroundVideo}
      >
        <source src="background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.content}>
        <div className={styles.profileContainer}>
          <div className={styles.profileImageWrapper}>
            <img 
              src="profile.jpg" 
              alt="Profile" 
              className={styles.profileImage}
            />
          </div>
        </div>

        <div className={styles.textContent}>
          <span className={styles.subtitle}>{contactTexts.subtitle}</span>

          <div className={styles.description}>
            <p>{contactTexts.description}</p>
          </div>

          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>{contactTexts.contactTitle}</h3>
            <div className={styles.contactItems}>
              <a href={`mailto:${contactTexts.email}`} className={styles.contactItem}>
                <EnvelopeIcon className={styles.contactIcon} />
                <span>{contactTexts.email}</span>
              </a>
              <a href={`tel:${contactTexts.phone.replace(/\s/g, '')}`} className={styles.contactItem}>
                <PhoneIcon className={styles.contactIcon} />
                <span>{contactTexts.phone}</span>
              </a>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={handleGoToProjects}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {contactTexts.buttonProjects}
              <span className={styles.arrow}>→</span>
            </button>

            <button
              onClick={handleGoToGitHub}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              <img src={githubLogo} alt="GitHub" className={styles.icon} />
              {contactTexts.buttonGithub}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}