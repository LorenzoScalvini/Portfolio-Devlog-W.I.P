import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`${styles.navbar} ${isLoaded ? styles.loaded : ''}`}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          LS.dev
        </NavLink>

        <button
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            Progetti
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            Contattami
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
