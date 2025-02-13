// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

// Import flag images (adjust the paths based on your project structure)
import enFlag from '../assets/flags/en.png';
import bgFlag from '../assets/flags/bg.png';
// Optionally, add more flags as needed:
// import frFlag from '../assets/flags/fr.png';
// import deFlag from '../assets/flags/de.png';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const flagStyle = {
    cursor: 'pointer',
    width: '24px',
    marginRight: '8px'
  };

  return (
    <div className="language-switcher" style={{ marginTop: '16px' }}>
      <img
        src={enFlag}
        alt="English"
        onClick={() => changeLanguage('en')}
        style={flagStyle}
      />
      <img
        src={bgFlag}
        alt="Español"
        onClick={() => changeLanguage('bg')}
        style={flagStyle}
      />
      {/* Uncomment below if adding more languages */}
      {/*
      <img
        src={frFlag}
        alt="Français"
        onClick={() => changeLanguage('fr')}
        style={flagStyle}
      />
      <img
        src={deFlag}
        alt="Deutsch"
        onClick={() => changeLanguage('de')}
        style={flagStyle}
      />
      */}
    </div>
  );
};

export default LanguageSwitcher;
