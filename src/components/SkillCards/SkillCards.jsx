import React from "react";
import styles from "./SkillCards.module.css";

import techStackImg from '../../assets/skillcard/tech-stack.png';
import toolsImg from '../../assets/skillcard/tools.png';
import personalSkillsImg from '../../assets/skillcard/personal-skills.png';
import programmingSkillsImg from '../../assets/skillcard/programming-skills.png';
import patternBg from '../../assets/skillcard/pattern-bg.png';

const SkillsCards = () => {
  const cardsData = [
    {
      title: "Stack Tecnologico",
      content: "Padroneggio linguaggi di programmazione e relativi framework:",
      icon: techStackImg,
      background: patternBg,
      tags: ["HTML", "CSS", "Tailwind", "Bootstrap", "JavaScript", "TypeScript", "Node.js", "React", "SQL", "C", "C++", "PHP"]
    },
    {
      title: "Strumenti e Applicazioni",
      content: "Usufruisco di applicazioni avanzate per lo sviluppo e design:",
      icon: toolsImg,
      background: patternBg,
      tags: ["Figma", "Excel", "VS Code", "Git", "GitHub", "Notion", "Photoshop", "Premiere Pro", "DaVinci Resolve"]
    },
    {
      title: "Competenze Personali",
      content: "Soft skills e capacità trasversali che arricchiscono il mio profilo:",
      icon: personalSkillsImg,
      background: patternBg,
      tags: ["Italiano Madrelingua", "Inglese Avanzato", "Teamwork", "Comunicazione", "Precisione", "Creatività", "Problem Solving"]
    },
    {
      title: "Competenze da Programmatore",
      content: "Specializzazioni tecniche e metodologie di sviluppo:",
      icon: programmingSkillsImg,
      background: patternBg,
      tags: ["UI/UX Design", "Performance Optimization", "Component Architecture", "API Integration", "Responsive Design", "Testing", "Debugging"]
    },
  ];

  return (
    <div className={styles.infoGrid}>
      {cardsData.map((card, index) => (
        <div key={index} className={styles.infoCard}>
          <img 
            src={card.background} 
            alt="Background pattern" 
            className={styles.cardBackground}
          />
          
          <img 
            src={card.icon} 
            alt={card.title}
            className={styles.cardIcon}
          />
          
          <h2 className={styles.cardTitle}>{card.title}</h2>
          <p className={styles.cardText}>{card.content}</p>
          
          <div className={styles.techTags}>
            {card.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className={styles.techTag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsCards;