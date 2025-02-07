import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../assets/styles/goBackButton.css";

const GoBackButton = ({ text = "Go Back" }) => {
  const navigate = useNavigate();

  return (
    <button className="go-back-button" onClick={() => navigate(-1)}>
      {text}
    </button>
  );
};

GoBackButton.propTypes = {
  text: PropTypes.string,
};

export default GoBackButton;
