import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ''
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ''
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ''
                  }
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ''
                  }
                >
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ''
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact Info</h3>
            <ul className={styles.contactInfo}>
              <li>Email: info@ls.dev</li>
              <li>Phone: +123 456 7890</li>
              <li>Address: 123 Main St, City, Country</li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Follow Us</h3>
            <ul className={styles.socialLinks}>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} LS.dev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
