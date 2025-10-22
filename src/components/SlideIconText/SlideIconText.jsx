import React from 'react';
import styles from './SlideIconText.module.css';
import JsLogo from '../../assets/Logos/JsLogo.png';
import CssLogo from '../../assets/Logos/CssLogo.png';
import TailwindLogo from '../../assets/Logos/TailwindLogo.png';
import ReactLogo from '../../assets/Logos/ReactLogo.png';

export default function SlideIconText() {
  const textItems = [
    'INNOVATIVE',
    'CREATIVE',
    'DYNAMIC',
    'EFFICIENT',
    'RELIABLE',
    'RESPONSIVE',
    'INTUITIVE',
    'FLEXIBLE',
  ];

  const logos = [
    { src: JsLogo, alt: 'javaScript' },
    { src: CssLogo, alt: 'CSS' },
    { src: TailwindLogo, alt: 'Tailwind' },
    { src: ReactLogo, alt: 'React' },
  ];

  const createSlideContent = () => {
    const content = [];
    let logoIndex = 0;

    for (let i = 0; i < textItems.length; i++) {
      content.push(
        <div key={`text-${i}`} className={styles.slide}>
          <span className={styles.slideText}>{textItems[i]}</span>
        </div>
      );

      if ((i + 1) % 2 === 0) {
        const currentLogo = logos[logoIndex % logos.length];
        content.push(
          <div key={`logo-${logoIndex}`} className={styles.logoSlide}>
            <img
              src={currentLogo.src}
              alt={currentLogo.alt}
              className={styles.logoImage}
            />
          </div>
        );
        logoIndex++;
      }
    }
    return content;
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {createSlideContent()}
          {createSlideContent()} 
        </div>
      </div>
    </div>
  );
}
