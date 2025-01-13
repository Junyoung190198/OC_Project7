import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const {auth} = useContext(AuthContext)

  useEffect(() => {

    const fetchDarkModePreference = async () => {
      try {
        const response = await fetch('http://localhost:5000/groupomania/auth/dark-mode', {
            method: 'GET',
            headers: { Authorization: `Bearer ${auth.token}`},
        });
        const data = await response.json();
        setDarkMode(data.DarkMode === 1);
      } catch (error) {
        console.error(error.message || error);
      }
    };

    fetchDarkModePreference();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newMode = !darkMode;
      setDarkMode(newMode);

      await fetch('http://localhost:5000/groupomania/auth/dark-mode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ DarkMode: newMode ? 1 : 0 }),
      });
    } catch (error) {
      console.error('Error updating dark mode preference:', error);
    }
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

