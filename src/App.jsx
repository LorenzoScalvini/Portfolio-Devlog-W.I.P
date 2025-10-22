import { useState, useEffect } from "react"
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import Footer from "./components/Footer/Footer"
import Loader from "./components/Loader/Loader"
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton"
import Contact from "./pages/Contact"
import GamePage from "./pages/GamePage"
import Me from "./pages/Me"
import "./App.css"

function AppContent() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const isGamePage = location.pathname === "/game"

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Force CSS animations to restart on route change
  useEffect(() => {
    const restartAnimations = () => {
      const body = document.body;
      body.style.animation = 'none';
      void body.offsetHeight; // Trigger reflow
      body.style.animation = null;
    };
    
    // Restart animations after component mounts and after load
    restartAnimations();
    window.addEventListener('load', restartAnimations);
    
    return () => window.removeEventListener('load', restartAnimations);
  }, []);

  return (
    <>
      {loading && <Loader />}

      {!isGamePage && <Navbar />}
      {!isGamePage && <ScrollToTopButton />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/me" element={<Me />} />
      </Routes>
      
      {!isGamePage && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}