import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/inspiration.css";
import inspirationImage from "/images/inspiration.webp";

const InspirationSection = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate("/inspiration");
  };

  return (
    <section className="inspiration-section">
      <div className="inspiration-container">
        <div className="inspiration-image">
          <img src={inspirationImage} alt="Our Inspiration" />
        </div>
        <div className="inspiration-text">
          <h2>OUR INSPIRATION</h2>
          <p>
            At NRG, we draw inspiration from the elegance of nature and the
            strength of innovation. Each piece is crafted to reflect balance and
            purpose.
          </p>
          <button className="learn-more-button" onClick={handleLearnMore}>
            LEARN MORE
          </button>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;
