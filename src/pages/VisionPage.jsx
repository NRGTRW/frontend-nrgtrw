import React from "react";
import "./VisionPage.css";

const VisionPage = () => {
  return (
    <div className="vision-page dark-mode vision-image-bg-only">
      <div className="hero-content simple" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="cosmic-title">Our Vision</h1>
        <div className="cosmic-video-player animate-video-reveal">
          <video
            className="explore-video"
            src="/videos/vision-explore-placeholder.mp4"
            controls
            autoPlay
            poster="/images/vision-cosmic-fallback.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default VisionPage; 