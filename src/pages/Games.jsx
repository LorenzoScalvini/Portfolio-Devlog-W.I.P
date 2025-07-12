import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Games.module.css';

// Componente di fallback durante il caricamento
const LoadingFallback = () => (
  <div className={styles.loading}>
    <div className={styles.loadingSpinner}></div>
    <p>Loading...</p>
  </div>
);

export default function Games() {
  const [currentComponent, setCurrentComponent] = useState(null);
  const [Component, setComponent] = useState(null);
  const navigate = useNavigate();

  const loadComponent = async (componentName) => {
    try {
      let Comp;
      if (componentName === 'sans') {
        Comp = (await import('../components/Sans/Sans')).default;
      } else if (componentName === 'asgore') {
        Comp = (await import('../components/Asgore/Asgore')).default;
      }
      
      setCurrentComponent(componentName);
      setComponent(() => Comp);
    } catch (error) {
      console.error('Failed to load component:', error);
    }
  };

  const handleBack = () => {
    setCurrentComponent(null);
    setComponent(null);
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {/* Pulsante per tornare alla home */}
      <button 
        className={styles.homeButton}
        onClick={goToHome}
      >
        Home
      </button>

      {!currentComponent ? (
        <div className={styles.selectionContainer}>
          <h1 className={styles.selectionTitle}>Choose Wisely</h1>
          <div className={styles.selectionButtons}>
            <button 
              className={styles.selectionButton}
              onClick={() => loadComponent('sans')}
            >
              Sans
            </button>
            <button 
              className={styles.selectionButton}
              onClick={() => loadComponent('asgore')}
            >
              Asgore
            </button>
          </div>
        </div>
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          {Component && <Component />}
        </Suspense>
      )}
      
      {currentComponent && (
        <button 
          className={styles.backButton}
          onClick={handleBack}
        >
          Back to Selection
        </button>
      )}
    </div>
  );
}