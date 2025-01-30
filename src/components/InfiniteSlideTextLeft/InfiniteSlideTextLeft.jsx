import { useEffect } from 'react';
import styles from './InfiniteSlideTextLeft.module.css';

export default function InfiniteSlideTextLeft() {
  // Array of text items
  const textItems = [
    'React.js',
    'Tailwind',
    'Frontend',
    'Javascript',
    'Backend',
    'CSS',
    'HTML',
    'UX/UI',
    'Tailwind',
    'Frontend',
    'Javascript',
  ];

  useEffect(() => {
    const container = document.querySelector(`.${styles.container}`);
    container.style.opacity = 0;
    setTimeout(() => {
      container.style.opacity = 1;
    }, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(`.${styles.container}`);
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        container.classList.add('fade-in');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {/* Original text items */}
          {textItems.map((text, index) => (
            <div key={index} className={styles.slide}>
              <span>{text}</span>
            </div>
          ))}
          {/* Cloned text items for seamless looping */}
          {textItems.map((text, index) => (
            <div key={`clone-${index}`} className={styles.slide}>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
