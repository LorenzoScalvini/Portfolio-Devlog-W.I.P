import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  HomeIcon,
  FolderIcon,
  EnvelopeIcon,
  XMarkIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";
import styles from "./Navbar.module.css";

const texts = {
  logo: "Lore.dev",
  ariaLabel: "Toggle menu",
  links: [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/projects", label: "Progetti", icon: FolderIcon },
    { to: "/contacts", label: "Contattami", icon: EnvelopeIcon },
    { to: "/games", label: "❤️", desktopOnly: true },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const checkIfDesktop = () => {
      const isDesktop = window.innerWidth > 1024 && !navigator.userAgent.match(/Mobile|Tablet|Android|iPhone|iPad|iPod/i);
      setIsDesktop(isDesktop);
    };
    
    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (to) => {
    setActiveLink(to);
    toggleMenu();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <nav className={`${styles.navbar} ${isLoaded ? styles.loaded : ""}`}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          {texts.logo}
        </NavLink>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label={texts.ariaLabel}
        >
          {isOpen ? (
            <XMarkIcon className={styles.menuIcon} />
          ) : (
            <Bars3Icon className={styles.menuIcon} />
          )}
        </button>

        <div className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
          {texts.links.map((link) => {
            if (link.desktopOnly && !isDesktop) return null;
            
            const IconComponent = link.icon;
            
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => handleLinkClick(link.to)}
                className={({ isActive }) =>
                  isActive || activeLink === link.to ? styles.activeLink : ""
                }
              >
                {IconComponent ? (
                  <>
                    <IconComponent className={styles.navIcon} />
                    <span>{link.label}</span>
                  </>
                ) : (
                  link.label
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}