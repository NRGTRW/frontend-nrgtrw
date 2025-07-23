import React, { useState } from 'react';
import './FeatureHighlights.css';

const FeatureHighlights = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const features = [
    {
      id: 1,
      icon: '💪',
      title: 'Fitness Excellence',
      description: 'Transform your body and mind with personalized training programs designed for real results.',
      stats: 'Personal Transformations',
      color: 'fitness'
    },
    {
      id: 2,
      icon: '🚀',
      title: 'Tech Innovation',
      description: 'Cutting-edge solutions that push boundaries and create lasting impact in the digital world.',
      stats: 'Projects Delivered',
      color: 'tech'
    },
    {
      id: 3,
      icon: '✨',
      title: 'Style & Design',
      description: 'Elevate your presence with curated fashion and design that speaks to your unique identity.',
      stats: 'Happy Clients',
      color: 'style'
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Vision Realization',
      description: 'Turn your dreams into reality with strategic planning and relentless execution.',
      stats: 'Goals Achieved',
      color: 'vision'
    }
  ];

  const handleFeatureClick = (feature) => {
    setModalMessage(`'${feature.title}' is currently in production.`);
    setShowModal(true);
  };

  return (
    <section className="feature-highlights nrg-feature-highlights">
      <div className="feature-container">
        <div className="feature-header">
          <h2 className="feature-title">What I Deliver</h2>
          <p className="feature-subtitle">
            Excellence across every discipline. Results that speak for themselves.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${feature.color}`}
              onClick={() => handleFeatureClick(feature)}
              style={{ cursor: 'pointer' }}
            >
              <div className="feature-icon">
                <span className="icon-emoji">{feature.icon}</span>
                <div className="icon-glow"></div>
              </div>
              
              <div className="feature-content">
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-stats">
                  <span className="stats-number">{feature.stats}</span>
                </div>
              </div>

              <div className="feature-hover-effect">
                <div className="hover-glow"></div>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="feature-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="feature-modal" onClick={e => e.stopPropagation()}>
              <p>{modalMessage}</p>
              <button onClick={() => setShowModal(false)} style={{marginTop: '18px'}}>Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureHighlights; 