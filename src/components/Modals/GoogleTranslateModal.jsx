import React from "react";
import "./GoogleTranslateModal.css";

const GoogleTranslateModal = ({ show, onClose, onTranslate, languageName }) => {
  if (!show) return null;
  return (
    <div className="gt-modal-overlay">
      <div className="gt-modal">
        <button className="gt-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="gt-modal-title">Choose Your Language</h2>
        <p className="gt-modal-desc">
          Would you like the site to be translated to <b>{languageName}</b> or keep it in English?
        </p>
        <div className="gt-modal-actions">
          <button className="gt-modal-btn" onClick={onTranslate}>
            Yes, translate to {languageName}
          </button>
          <button className="gt-modal-btn gt-modal-btn-secondary" onClick={onClose}>
            No, keep in English
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleTranslateModal; 