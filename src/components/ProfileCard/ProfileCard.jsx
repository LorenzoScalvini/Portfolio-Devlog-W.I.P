import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import Image from '../../assets/placeholder.png';

export default function ProfileCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Benvenuto nel mio Profilo!</h1>

        <div className={styles.animatedTitleContainer}>
          <h2 className={styles.animatedTitle}>Chi sono?</h2>
        </div>
        <div className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
          <img src={Image} alt="Profilo" className={styles.image} />
          <p className={styles.text}>
            Mi chiamo Lorenzo e ho studiato Informatica all'ITIS durante le
            scuole superiori. Fin da subito, ho sviluppato una grande passione
            per la programmazione e la tecnologia. Mi piace risolvere problemi
            complessi e creare soluzioni innovative.
          </p>
        </div>

        <div className={styles.animatedTitleContainer}>
          <h2 className={styles.animatedTitle}>Progetti e Sperimentazione</h2>
        </div>
        <div className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
          <p className={styles.text}>
            Mi piace sperimentare e costruire progetti che mi permettano di
            mettere in pratica ciò che imparo. Ho realizzato diverse
            applicazioni web, tra cui un gestionale per piccole aziende e un'app
            per la gestione delle task quotidiane.
          </p>
          <img src={Image} alt="Progetti" className={styles.image} />
        </div>

        <div className={styles.animatedTitleContainer}>
          <h2 className={styles.animatedTitle}>Apprendimento Continuo</h2>
        </div>
        <div className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
          <img src={Image} alt="Apprendimento" className={styles.image} />
          <p className={styles.text}>
            Credo che l'apprendimento continuo sia fondamentale nello sviluppo
            web e nella programmazione. Seguo costantemente corsi online,
            partecipo a conferenze e leggo libri per rimanere aggiornato sulle
            ultime tecnologie.
          </p>
        </div>

        <div className={styles.animatedTitleContainer}>
          <h2 className={styles.animatedTitle}>Competenze Tecniche</h2>
        </div>
        <div className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
          <p className={styles.text}>
            Le mie competenze tecniche includono: HTML, CSS, JavaScript, React,
            Node.js, Python e SQL. Ho anche esperienza con strumenti di
            versionamento come Git e piattaforme di sviluppo come Docker.
          </p>
          <img src={Image} alt="Competenze" className={styles.image} />
        </div>

        <div className={styles.animatedTitleContainer}>
          <h2 className={styles.animatedTitle}>Obiettivi Futuri</h2>
        </div>
        <div className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
          <img src={Image} alt="Obiettivi" className={styles.image} />
          <p className={styles.text}>
            Il mio obiettivo è continuare a crescere professionalmente,
            lavorando su progetti sempre più complessi e sfidanti. Vorrei
            specializzarmi nello sviluppo di applicazioni web scalabili e ad
            alte prestazioni.
          </p>
        </div>
      </div>
    </div>
  );
}
