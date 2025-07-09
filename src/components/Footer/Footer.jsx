import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";
import instagramLogo from "../../assets/Logos/InstagramLogo.svg";
import githubLogo from "../../assets/Logos/GithubLogo.svg";
import linkedinLogo from "../../assets/Logos/linkedinLogo.svg";

const footerTexts = {
  infoTitle: "Informazioni",
  contactInfo: [
    "Email: lorenzo.scalvini.dev@gmail.com",
    "Phone: +39 ??? ??? ????",
    "Brescia (BS)",
  ],
  followTitle: "Seguimi",
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/yourfavboylore?igsh=MTVxcDU4cTBkajVqYg%3D%3D&utm_source=qr",
      icon: instagramLogo,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/lorenzo-scalvini-a2a68a31b/",
      icon: linkedinLogo,
    },
    {
      label: "GitHub",
      href: "https://github.com/LorenzoScalvini",
      icon: githubLogo,
    },
  ],
  copyright: `© ${new Date().getFullYear()} LS.dev. All rights reserved.`,
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Informazioni */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{footerTexts.infoTitle}</h3>
            <ul className={styles.contactInfo}>
              {footerTexts.contactInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>{footerTexts.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
