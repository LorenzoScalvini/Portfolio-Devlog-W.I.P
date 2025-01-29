import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>© 2025 All rights reserved.</p>
        <div className={styles.contact}>
          <a href="mailto:info@yourcompany.com" className={styles.link}>
            lorenzoscalvini@gmail.com
          </a>
          <a href="tel:+1234567890" className={styles.link}>
            +39 (234) 567-8906
          </a>
        </div>
      </div>
    </footer>
  );
}
