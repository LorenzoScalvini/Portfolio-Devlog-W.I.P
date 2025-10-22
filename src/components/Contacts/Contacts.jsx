import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contacts.module.css";
import githubLogo from "../../assets/Logos/GithubLogo.svg";
import linkedinLogo from "../../assets/Logos/linkedinLogo.svg"; 
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const contactTexts = {
  subtitle: "Disponibile per nuove opportunità",
  description:
    "Programmatore / Web Developer: realizzo soluzioni web moderne, accessibili e performanti con tecnologie come React, TypeScript e Tailwind. Competenze in UI/UX, integrazione API.",
  buttonLinkedIn: "LinkedIn", 
  buttonGithub: "Github",
  linkedinUrl: "https://www.linkedin.com/in/lorenzo-scalvini-a2a68a31b/", 
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

  const handleGoToLinkedIn = () => { 
    window.open(contactTexts.linkedinUrl, "_blank");
  };

  return (
    <section className={styles.contactSection}>
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
              onClick={handleGoToLinkedIn} 
              className={`${styles.button} ${styles.primaryButton}`}
            >
              <img src={linkedinLogo} alt="LinkedIn" className={styles.icon} /> 
              {contactTexts.buttonLinkedIn} 
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