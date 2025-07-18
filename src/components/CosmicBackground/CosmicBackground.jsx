import React from 'react';
import './CosmicBackground.css';

// Default palette (fallback)
const defaultPalette = {
  gradient: [
    '#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533483'
  ],
  nebula1: 'rgba(255, 100, 200, 0.4)',
  nebula2: 'rgba(100, 200, 255, 0.3)',
  star: '#fff',
  accent: '#ffe067',
  planet: '#ffe067',
  crown: '#f5c518',
};

const CosmicBackground = ({ palette = defaultPalette }) => {
  // Build gradient string from palette
  const gradient = `linear-gradient(135deg, ${palette.gradient.join(', ')})`;

  return (
    <div className="cosmic-background">
      {/* Nebula clouds with palette colors */}
      <div
        className="cosmic-nebula"
        style={{
          '--nebula1': palette.nebula1,
          '--nebula2': palette.nebula2,
        }}
      ></div>
      {/* Shooting stars */}
      <div className="cosmic-shooting-star"></div>
      <div className="cosmic-shooting-star"></div>
      <div className="cosmic-shooting-star"></div>
      <div className="cosmic-shooting-star"></div>
      {/* Cosmic particles */}
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
      <div className="cosmic-particle"></div>
    </div>
  );
};

export default CosmicBackground; 