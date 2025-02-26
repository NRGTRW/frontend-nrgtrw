import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "../assets/styles/TermsPopup.css";

const TermsPopup = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const acceptedTerms = localStorage.getItem('acceptedTerms');
    if (!acceptedTerms) {
      setIsOpen(true);
    }
  }, []);

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
