import React, { createContext, useState, useEffect } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dark-mode');
    if (saved === 'true') setIsDark(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('dark-mode', isDark);
  }, [isDark]);

  return (
    <DarkModeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};
