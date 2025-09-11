import React from 'react';

export default function ModernBackground() {
  return (
    <div className="ambient-container">
      <div className="ambient-bg">
        {/* Animated gradient background */}
        <div className="ambient-gradient" />
        
        {/* Floating orbs */}
        <div className="ambient-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        
        {/* Grid pattern */}
        <div className="ambient-grid" />
        
        {/* Particle system */}
        <div className="ambient-particles">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>
      </div>
    </div>
  );
}
