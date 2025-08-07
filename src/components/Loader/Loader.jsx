import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderSpinner}></div>
    </div>
  );
};

export default Loader;
