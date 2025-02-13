import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../assets/styles/goBackButton.css";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="go-back-button" onClick={() => navigate(-1)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M10 19L3 12l7-7v4h11v6H10v4z" />
      </svg>
    </button>
  );
};

GoBackButton.propTypes = {
  text: PropTypes.string,
};

export default GoBackButton;
