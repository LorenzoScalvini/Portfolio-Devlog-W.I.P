import React, { useState } from 'react';
import styles from './CardGrid.module.css';

const CardGrid = () => {
  const allCards = [
    {
      id: 1,
      image: 'https://placehold.co/600x400',
      title: 'Design Moderno',
      tags: ['UI/UX', 'Responsive', 'Mobile']
    },
    {
      id: 2,
      image: 'https://placehold.co/600x400',
      title: 'Sviluppo Web',
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 3,
      image: 'https://placehold.co/600x400',
      title: 'Digital Marketing',
      tags: ['SEO', 'Social Media', 'Analytics']
    },
    {
      id: 4,
      image: 'https://placehold.co/600x400',
      title: 'E-commerce',
      tags: ['Shopify', 'WooCommerce', 'Magento']
    },
    {
      id: 5,
      image: 'https://placehold.co/600x400',
      title: 'Consulenza IT',
      tags: ['Cloud', 'Security', 'Infrastructure']
    },
    {
      id: 6,
      image: 'https://placehold.co/600x400',
      title: 'App Mobile',
      tags: ['iOS', 'Android', 'React Native']
    },
    {
      id: 7,
      image: 'https://placehold.co/600x400',
      title: 'Branding',
      tags: ['Logo', 'Identity', 'Print']
    },
    {
      id: 8,
      image: 'https://placehold.co/600x400',
      title: 'Data Analytics',
      tags: ['Python', 'Machine Learning', 'BI']
    },
    {
      id: 9,
      image: 'https://placehold.co/600x400',
      title: 'Automazione',
      tags: ['Workflow', 'API', 'Integration']
    },
    {
      id: 10,
      image: 'https://placehold.co/600x400',
      title: 'Fotografia',
      tags: ['Portfolio', 'Studio', 'Commercial']
    },
    {
      id: 11,
      image: 'https://placehold.co/600x400',
      title: 'Content Creation',
      tags: ['Video', 'Blog', 'Social']
    },
    {
      id: 12,
      image: 'https://placehold.co/600x400',
      title: 'Cybersecurity',
      tags: ['Penetration Testing', 'Audit', 'Compliance']
    }
  ];

  const [visibleCards, setVisibleCards] = useState(6);
  const cardsPerLoad = 6;

  const loadMore = () => {
    setVisibleCards(prev => Math.min(prev + cardsPerLoad, allCards.length));
  };

  const currentCards = allCards.slice(0, visibleCards);
  const hasMore = visibleCards < allCards.length;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {currentCards.map((card) => (
          <div key={card.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img 
                src={card.image} 
                alt={card.title}
                className={styles.cardImage}
              />
              <div className={styles.overlay}>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <div className={styles.tags}>
                    {card.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            onClick={loadMore}
            className={styles.loadMoreButton}
          >
            <span>Carica Altri</span>
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CardGrid;