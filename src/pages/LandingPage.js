import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import heroImg from '../assets/hero.png';
import feature1 from '../assets/feature1.png';
import feature2 from '../assets/feature2.png';
import feature3 from '../assets/feature3.png';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="landing-wrapper"
    >
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div className="hero-content" {...fadeIn(0)}>
          <h1 className="hero-title">Welcome to Imagle</h1>
          <p className="hero-subtext">Effortless image discovery, approval, and download system tailored for creators and admins.</p>
          <div className="cta-group">
            <button className="cta-btn primary" onClick={() => navigate('/login')}>Login</button>
            <button className="cta-btn secondary" onClick={() => navigate('/signup')}>Create Account</button>
          </div>
        </motion.div>
        <motion.div className="hero-image" {...fadeIn(0.2)}>
          <img src={heroImg} alt="Hero Visual" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2 className="section-heading" {...fadeIn(0.1)}>Why Choose Imagle?</motion.h2>
        <motion.p className="section-subtext" {...fadeIn(0.2)}>Discover how Imagle enhances your image workflow.</motion.p>
        <div className="features-grid">
          <motion.div className="feature-card" {...fadeIn(0.3)}>
            <img src={feature1} alt="Smart Search" />
            <h3>Smart Search</h3>
            <p>Intelligently filter and find images by tags and keywords.</p>
          </motion.div>
          <motion.div className="feature-card" {...fadeIn(0.4)}>
            <img src={feature2} alt="Request & Approve" />
            <h3>Request & Approve</h3>
            <p>Easily submit and manage image requests through an intuitive interface.</p>
          </motion.div>
          <motion.div className="feature-card" {...fadeIn(0.5)}>
            <img src={feature3} alt="Batch Downloads" />
            <h3>Batch Downloads</h3>
            <p>Download approved content in one organized ZIP package.</p>
          </motion.div>
        </div>
      </section>

      {/* Call To Action Section */}
      <motion.section className="cta-footer" {...fadeIn(0.6)}>
        <h2>Start Your Visual Journey Today</h2>
        <p>Join Imagle and streamline your entire image workflow in minutes.</p>
        <button className="cta-btn primary" onClick={() => navigate('/signup')}>Sign Up Free</button>
      </motion.section>
    </motion.div>
  );
};

export default LandingPage;