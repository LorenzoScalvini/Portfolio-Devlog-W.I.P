import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";
import instagramLogo from "../../assets/Logos/InstagramLogo.svg";
import githubLogo from "../../assets/Logos/GithubLogo.svg";
import linkedinLogo from "../../assets/Logos/linkedinLogo.svg";
import item1 from "../../assets/footerdeco/item1.gif";
import item2 from "../../assets/footerdeco/item2.gif";
import item3 from "../../assets/footerdeco/item3.gif";
import item4 from "../../assets/footerdeco/item4.gif";
import item5 from "../../assets/footerdeco/item5.gif";

const pokemonImages = {
  left: item1,
  center: item2,
  centerRight: item4,
  centerLeft: item5,
  right: item3,
};

const footerTexts = {
  infoTitle: "Informazioni",
  contactInfo: [
    "Email: lorenzo.scalvini1704@gmail.com",
    "Phone: +39 379 151 0526",
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
      <div className={styles.pokemonContainer}>
        <img src={pokemonImages.left} alt="Pokemon sinistro" className={styles.pokemonImage} />
        <img src={pokemonImages.center} alt="Pokemon centrale" className={styles.pokemonImage} />
        <img src={pokemonImages.centerLeft} alt="Pokemon centro-sinistro" className={styles.pokemonImage} />
        <img src={pokemonImages.centerRight} alt="Pokemon centro-destro" className={styles.pokemonImage} />
        <img src={pokemonImages.right} alt="Pokemon destro" className={styles.pokemonImage} />
      </div>
      
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{footerTexts.infoTitle}</h3>
            <ul className={styles.contactInfo}>
              {footerTexts.contactInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{footerTexts.followTitle}</h3>
            <ul className={styles.socialLinks}>
              {footerTexts.socialLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <img src={link.icon} alt={link.label} className={styles.socialIcon} />
                    <span>{link.label}</span>
                  </a>
                </li>
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