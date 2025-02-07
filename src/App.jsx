import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
// import CustomCursor from './components/CustomCursor/CustomCursor';
import './App.css';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Il componente AppContent gestisce il routing e lo stato di caricamento
function AppContent() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Mostra il loader per 500ms al cambio di rotta
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* <CustomCursor /> */}
      {loading && <Loader />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}
