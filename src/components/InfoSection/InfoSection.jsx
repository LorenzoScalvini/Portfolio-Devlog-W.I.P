import React from 'react';
import styles from './InfoSection.module.css';

const InfoSection = () => {
  const socialPlatforms = [
    {
      name: 'Notion',
      description: 'Blog & Documentazione',
      features: ['Guide tecniche', 'Tutorial dettagliati', 'Risorse sviluppo'],
      url: 'https://www.notion.so',
    },
    {
      name: 'LinkedIn',
      description: 'Profilo Professionale',
      features: [
        'Esperienze lavorative',
        'Progetti completati',
        'Network tech',
      ],
      url: 'https://www.linkedin.com',
    },
    {
      name: 'Instagram',
      description: 'Contenuti visivi',
      features: ['Post su progetti', 'Storie quotidiane', 'Dietro le quinte'],
      url: 'https://www.instagram.com',
    },
    {
      name: 'GitHub',
      description: 'Codice & Repositories',
      features: ['Progetti open-source', 'Collaborazioni', 'Codice aggiornato'],
      url: 'https://www.github.com',
    },
  ];

  return (
    <section className={styles.infoSection}>
      <div className={styles.glowBackground}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.subtitle}>Esplora i miei contenuti</span>
            <h2 className={styles.title}>Dove puoi trovarmi</h2>
          </div>

          <div className={styles.platformGrid}>
            {socialPlatforms.map((platform) => (
              <div key={platform.name} className={styles.platformCard}>
                <div className={styles.cardHeader}>
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>
                </div>

                <ul className={styles.featureList}>
                  {platform.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="#"
                  className={styles.visitButton}
                >
                  Visita {platform.name}
                  <span className={styles.arrow}>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
