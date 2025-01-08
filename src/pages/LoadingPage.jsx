/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import "../assets/styles/loadingPage.css";

const LoadingPage = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div className="loading-page">
      <div className="loading-spinner"></div>
      <h2 className="loading-text">Preparing Your Experience...</h2>
    </div>
  );
};

export default LoadingPage;
