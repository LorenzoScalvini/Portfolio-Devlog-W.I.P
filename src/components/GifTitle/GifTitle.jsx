import React, { useEffect, useState } from "react";
import styles from "./GifTitle.module.css";
import gifSrc from "../../assets/TitleGif.gif"; // Replace with your actual gif file

const GifTitle = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  return (
    <div className={`${styles.container} ${loaded ? styles.visible : ""}`}>
      <h1 className={styles.title}>Welcome to My Page</h1>
      <img src={gifSrc} alt="Animated GIF" className={styles.gif} />
    </div>
  );
};

export default GifTitle;
