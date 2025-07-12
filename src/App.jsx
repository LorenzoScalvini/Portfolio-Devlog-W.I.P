import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Projects from './pages/Projects';
import Games from './pages/Games';
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import Me from './pages/Me';
import "./App.css";

function AppContent() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Controlla se la route corrente è /games
  const isGamesRoute = location.pathname === '/games';

  return (
    <>
      {loading && <Loader />}
      
      {/* Mostra Navbar solo se non è la route /games */}
      {!isGamesRoute && <Navbar />}
      
      {!isGamesRoute && <ScrollToTopButton />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/games" element={<Games />} />
        <Route path="/contacts" element={<Me />} />
      </Routes>
      
      {/* Mostra Footer solo se non è la route /games */}
      {!isGamesRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}