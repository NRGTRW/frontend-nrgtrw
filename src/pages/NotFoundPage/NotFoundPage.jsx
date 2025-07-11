import React from "react";
import { useNavigate } from "react-router-dom";
import "./notFound.css";

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
const notFoundImage = S3_BASE + "images/404NotFound.webp";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="not-found-page"
      style={{
        backgroundImage: `url(${notFoundImage})`, // Dynamically set the background
      }}
    >
      <div className="not-found-content">
        <h1>Oops! Page Not Found</h1>
        <p>
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>
        <button onClick={() => navigate("/")} className="back-home-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
