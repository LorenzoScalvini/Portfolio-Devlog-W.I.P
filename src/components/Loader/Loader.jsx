import React from 'react';
import styles from './Loader.module.css'; // Importa i stili come CSS Module

const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderSpinner}></div>
    </div>
  );
};

export default Loader;
