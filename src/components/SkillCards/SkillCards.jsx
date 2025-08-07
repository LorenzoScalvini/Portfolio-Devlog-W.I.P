import React from "react";
import styles from "./SkillCards.module.css";

const SkillsCards = () => {
  const cardsData = [
    {
      title: "Stack Tecnologico",
      content:
        "Padroneggio linguaggi di programmazione e relativi framework: HTML, CSS, Tailwind CSS, Bootstrap, Javascript, Typescript, Node.js, React.js, SQL, C, C++, PHP",
    },
    {
      title: "Strumenti e Applicazioni",
      content:
        "Usufruisco di applicazioni: Figma, Excel, Word, Powerpoint, Visual Studio Code, versionamento con Git e GitHub, Notion, Photoshop, Premiere Pro e DaVinci Resolve",
    },
    {
      title: "Competenze Personali",
      content:
        "Madrelingua italiana e grande padronanza della lingua inglese, curiosità e volontà di imparare, capacità di comunicazione e teamwork, precisione ed attenzione ai dettagli.",
    },
    {
      title: "Competenze da Programmatore",
      content:
        "Progettazione e sviluppo software, UI/UX development, performance optimization, component-based architecture, API integration.",
    },
  ];

  return (
    <div className={styles.infoGrid}>
      {cardsData.map((card, index) => (
        <div key={index} className={styles.infoCard}>
          <h2 className={styles.cardTitle}>{card.title}</h2>
          <p className={styles.cardText}>{card.content}</p>
        </div>
      ))}
    </div>
  );
};

export default SkillsCards;
