import React, { useEffect, useRef } from 'react';
import styles from './ImageCarousel.module.css';
import img1 from '../../assets/ProjectsCardsImg/image1.jpg';
import img2 from '../../assets/ProjectsCardsImg/image2.jpg';
import img3 from '../../assets/ProjectsCardsImg/image3.jpg';
import img4 from '../../assets/ProjectsCardsImg/image4.jpg';
import img5 from '../../assets/ProjectsCardsImg/image5.jpg';
import img6 from '../../assets/ProjectsCardsImg/image6.jpg';
import img7 from '../../assets/ProjectsCardsImg/image7.jpg';
import img8 from '../../assets/ProjectsCardsImg/image8.jpg';
import img9 from '../../assets/ProjectsCardsImg/image9.jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const ImageCarousel = () => {
  const carouselRef = useRef(null);
  let angle = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      angle += 40;
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${angle}deg)`;
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carouselSection}>
      <div className={styles.glowBackground} />
      <div className={styles.carouselContainer}>
        <div ref={carouselRef} className={styles.carousel}>
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.imageItem}
              style={{
                '--rotation': `${index * 40}deg`,
                transform: `rotateY(${index * 40}deg) translateZ(500px)`,
                animationDelay: `${0.8 + index * 0.1}s`,
              }}
            >
              <div className={styles.imageWrapper}>
                <div className={styles.imageGlow} />
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
