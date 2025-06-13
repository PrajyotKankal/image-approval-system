import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dark-mode') === 'true';
    setIsDark(stored);
    document.body.classList.toggle('dark-mode', stored);
  }, []);

  const toggleMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('dark-mode', newMode);
  };

  return (
    <p className="dropdown-item" onClick={toggleMode}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </p>
  );
};

export default DarkModeToggle;
