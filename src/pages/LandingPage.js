import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.8, 0.25, 1] }
  },
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="landing-wrapper"
    >
      <section className="hero-center-section">
        <motion.h1 className="hero-title" {...fadeIn(0)}>Welcome to Imagle</motion.h1>
        <motion.p className="hero-subtext" {...fadeIn(0.1)}>
          Effortless image discovery, approval, and download system tailored for internal teams.
        </motion.p>
        <motion.p className="tagline" {...fadeIn(0.2)}>Built for creators. Trusted by professionals.</motion.p>
        <div className="cta-container">
          <div className="cta-group">
            <button className="button2" onClick={() => navigate('/login')}>Login</button>
            <button className="button2 light" onClick={() => navigate('/signup')}>Create Account</button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
