import React from "react";
import "./CosmicBackground.css";
import PropTypes from "prop-types";

// Default palette (fallback)
const defaultPalette = {
  gradient: ["#0a0a0a", "#1a1a2e", "#16213e", "#0f3460", "#533483"],
  nebula1: "rgba(255, 100, 200, 0.4)",
  nebula2: "rgba(100, 200, 255, 0.3)",
  star: "#fff",
  accent: "#ffe067",
  planet: "#ffe067",
  crown: "#f5c518",
};

const CosmicBackground = ({ palette = defaultPalette }) => {
  // Build gradient string from palette
  const gradient = `linear-gradient(135deg, ${palette.gradient.join(", ")})`;

  // Generate a very dense, natural star field across the full width
  const starCount = 777;
  const stars = Array.from({ length: starCount }).map((_, i) => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = (Math.random() * 10).toFixed(2);
    const size = (1 + Math.random() * 2).toFixed(1); // 1-3px
    const opacity = (0.5 + Math.random() * 0.5).toFixed(2); // 0.5-1
    const angle = Math.random() * 2 * Math.PI; // 0 to 2π radians
    const distance = 120 + Math.random() * 80; // px, how far the star travels
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return (
      <div
        key={i}
        className="cosmic-particle"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          animationDelay: `${delay}s`,
          "--star-x": `${x}px`,
          "--star-y": `${y}px`,
        }}
      ></div>
    );
  });

  // More shooting stars
  const shootingStars = Array.from({ length: 8 }).map((_, i) => (
    <div
      key={i}
      className="cosmic-shooting-star"
      style={{ top: `${10 + i * 10}%`, left: 0, animationDelay: `${i * 1.5}s` }}
    ></div>
  ));

  // Remove lasers, explosions, and fighters. Only render stars, nebula, and shooting stars.
  return (
    <div className="cosmic-background">
      {/* Nebula clouds with palette colors */}
      <div
        className="cosmic-nebula"
        style={{
          "--nebula1": palette.nebula1,
          "--nebula2": palette.nebula2,
        }}
      ></div>
      {/* Shooting stars */}
      {shootingStars}
      {/* Dense cosmic particles (stars) */}
      {stars}
    </div>
  );
};

CosmicBackground.propTypes = {
  palette: PropTypes.object,
};

export default CosmicBackground;
