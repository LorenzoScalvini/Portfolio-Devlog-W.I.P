import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Projects from './pages/Projects'
import Asgore from './pages/Asgore'
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import Me from './pages/Me'
import "./App.css";

function AppContent() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/asgore" element={<Asgore />} />
        <Route path="/contacts" element={<Me />} />
      </Routes>
      <Footer />
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