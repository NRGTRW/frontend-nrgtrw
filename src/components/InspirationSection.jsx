import React from "react";
import "../assets/styles/inspiration.css";
import icecreamInspiration from "../assets/images/icecream-inspiration.webp";

const InspirationSection = () => {
  return (
    <section className="inspiration-section">
      <img src={icecreamInspiration} alt="Inspiration Ice Cream" />
      <h2>OUR INSPIRATION</h2>
      <p>IS THE NEVER ENDING FIRE INSIDE US TO BE BETTER</p>
      <a href="#" className="read-more">READ MORE</a>
    </section>
  );
};

export default InspirationSection;
