import React, { useState, useRef } from 'react';
import styles from './CardGrid.module.css';
import img1 from '../../assets/ProjectsCardsImg/image1.png';
import img2 from '../../assets/ProjectsCardsImg/image2.png';
import img3 from '../../assets/ProjectsCardsImg/image3.png';
import img6 from '../../assets/ProjectsCardsImg/image6.gif';
import githubLogo from "../../assets/Logos/GithubLogo.svg";

export default function CardGrid() {
  const allCards = [
    {
      id: 1,
      image: img1,
      title: 'Pomodoro Timer',
      tags: ['UI/UX', 'Javascript', 'HTML', 'CSS', 'Productivity'],
      githubUrl: 'https://github.com/LorenzoScalvini/Javascript-pomodoro-timer'
    },
    {
      id: 2,
      image: img2,
      title: 'Asgore Undertale Remake',
      tags: ['React', 'JavaScript', 'Video Game', 'CSS', 'Web Game'],
      githubUrl: '#'
    },
    {
      id: 3,
      image: 'https://placehold.co/600x400',
      title: 'Progetto 3',
      tags: ['React', 'JavaScript', 'Video Game', 'CSS', 'Web Game'],
      githubUrl: '#'
    },
    {
      id: 4,
      image: 'https://placehold.co/600x400',
      title: 'Progetto 4',
      tags: ['Frontend', 'React', 'JavaScript', 'Productivity', 'Backend'],
      githubUrl: '#'
    },
    {
      id: 5,
      image: 'https://placehold.co/600x400',
      title: 'Progetto 5',
      tags: [],
      githubUrl: '#'
    },
    {
      id: 6,
      image: img6,
      title: 'Old personal portfolio',
      tags: ['UI/UX', 'React', 'CSS', 'JavaScript'],
      githubUrl: '#'
    },
    {
      id: 7,
      image: 'https://placehold.co/600x400',
      title: 'Progetto 7',
      tags: [],
      githubUrl: '#'
    },
    {
      id: 8,
      image: 'https://placehold.co/600x400',
      title: 'Progetto 8',
      tags: [],
      githubUrl: '#'
    },
    {
      id: 9,
      image: 'https://placehold.co/600x400',
      title: 'Progetto 9',
      tags: [],
      githubUrl: '#'
    }
  ];

  const [visibleCards, setVisibleCards] = useState(6);
  const [selectedTag, setSelectedTag] = useState('Tutti');
  const tagsScrollRef = useRef(null);
  const cardsPerLoad = 6;

  const allTags = ['Tutti'];
  allCards.forEach(card => {
    card.tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  const loadMore = () => {
    setVisibleCards(prev => Math.min(prev + cardsPerLoad, allCards.length));
  };

  const scrollTags = (direction) => {
    if (tagsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tagsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCards = selectedTag === 'Tutti' 
    ? allCards 
    : allCards.filter(card => card.tags.includes(selectedTag));

  const currentCards = filteredCards.slice(0, visibleCards);
  const hasMore = visibleCards < filteredCards.length;

  return (
    <div className={styles.container}>
      {/* Filtro Tags */}
      <div className={styles.tagsFilterContainer}>
        <button 
          className={styles.scrollButton} 
          onClick={() => scrollTags('left')}
          aria-label="Scroll tags left"
        >
          &lt;
        </button>
        
        <div className={styles.tagsScrollContainer} ref={tagsScrollRef}>
          <div className={styles.tagsList}>
            {allTags.map((tag, index) => (
              <button
                key={index}
                className={`${styles.filterTag} ${selectedTag === tag ? styles.active : ''}`}
                onClick={() => {
                  setSelectedTag(tag);
                  setVisibleCards(cardsPerLoad);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className={styles.scrollButton} 
          onClick={() => scrollTags('right')}
          aria-label="Scroll tags right"
        >
          &gt;
        </button>
      </div>

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
                  <a 
                    href={card.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.githubButton}
                  >
                    <img 
                      src={githubLogo} 
                      alt="GitHub" 
                      className={styles.githubIcon}
                    />
                    View on GitHub
                  </a>
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
}