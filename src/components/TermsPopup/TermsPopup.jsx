// TermsPopup.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import "./TermsPopup.css"; // Uncomment and adjust path as needed

const TermsPopup = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // If the current path is /terms, do not show the popup
    if (location.pathname === '/terms') {
      setIsOpen(false);
      return;
    }
    // Otherwise, check if the user has already accepted the terms
    const acceptedTerms = localStorage.getItem('acceptedTerms');
    if (!acceptedTerms) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const handleSubmit = () => {
    if (isChecked) {
      localStorage.setItem('acceptedTerms', 'true');
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="terms-popup-overlay">
      <div className="terms-popup-container">
        <p className="popup-text">
          {t('termsPopup.welcome')}&nbsp;
          <a href="/terms" className="terms-link">{t('termsPopup.termsLink')}</a>.
        </p>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="acceptTerms">{t('termsPopup.checkboxLabel')}</label>
        </div>
        <button
          className="popup-submit-btn"
          onClick={handleSubmit}
          disabled={!isChecked}
        >
          {t('termsPopup.submit')}
        </button>
      </div>
    </div>
  );
};

export default TermsPopup;
