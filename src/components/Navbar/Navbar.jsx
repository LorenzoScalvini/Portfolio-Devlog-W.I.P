// Import delle librerie e dei componenti necessari
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  // Stato per gestire l'apertura/chiusura del menu
  const [isOpen, setIsOpen] = useState(false);

  // Stato per gestire il caricamento della navbar
  const [isLoaded, setIsLoaded] = useState(false);

  // Effetto per gestire il caricamento della pagina
  useEffect(() => {
    // Funzione che imposta isLoaded a true quando la pagina è completamente caricata
    const handleLoad = () => {
      setIsLoaded(true);
    };

    // Aggiunge un listener per l'evento 'load' della finestra
    window.addEventListener('load', handleLoad);

    // Pulizia: rimuove il listener quando il componente viene smontato
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  // Funzione per aprire/chiudere il menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Render del componente Navbar
  return (
    <nav className={`${styles.navbar} ${isLoaded ? styles.loaded : ''}`}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          LS.dev
        </NavLink>

        {/* Bottone hamburger per aprire/chiudere il menu su dispositivi mobili */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Contenitore per i link di navigazione */}
        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu} // Chiude il menu al click su un link
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
            to="/services"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            Servizi
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
            onClick={toggleMenu}
          >
            Contatti
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
