import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../HomepageComponents.jsx/Navbar';
import About from '../HomepageComponents.jsx/About';
import Contact from '../HomepageComponents.jsx/Contact';
import Footer from '../HomepageComponents.jsx/Footer';
import Showcase from '../HomepageComponents.jsx/Showcase';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Delay ensures DOM elements are mounted
      }
    }
  }, [location.state]);

  return (
    <div>
      <Navbar />
      <Showcase />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
