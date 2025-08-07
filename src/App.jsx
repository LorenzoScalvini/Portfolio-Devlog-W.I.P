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
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import InfiniteSlideIconText from './components/SlideIconText/SlideIconText';
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

  const isGamesRoute = location.pathname.endsWith('/games');

  return (
    <>
      {loading && <Loader />}
      
      {/* Mostra Navbar solo se non è la route /games */}
      {!isGamesRoute && <Navbar />}
      
      {!isGamesRoute && <ScrollToTopButton />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contacts" element={<Me />} />
      </Routes>
      
      {!isGamesRoute && <InfiniteSlideIconText />}
      
      {/* Mostra Footer solo se non è la route /games */}
      {!isGamesRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router basename="/Portfolio-Devlog-W.I.P">
      <AppContent />
    </Router>
  );
}