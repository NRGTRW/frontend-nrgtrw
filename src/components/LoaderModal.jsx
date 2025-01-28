import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "../assets/styles/loaderModal.css";

const LoaderModal = ({ message = "Please wait..." }) => {
  return (
    <div className="loader-modal">
      <div className="loader-modal-content">
        <div className="loader-modal-spinner"></div>
        <p className="loader-modal-message">{message}</p>
      </div>
    </div>
  );
};

// ✅ Add PropTypes validation
LoaderModal.propTypes = {
  message: PropTypes.string, // The message prop must be a string
};

export default LoaderModal;
