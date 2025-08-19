import React from "react";
import "./VisionPage.css";

const VisionPage = () => {
  return (
    <div className="vision-page dark-mode vision-image-bg-only">
      <div
        className="hero-content simple"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className="cosmic-title">Our Vision</h1>
        <div className="cosmic-video-player animate-video-reveal">
          <iframe
            className="explore-video"
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/5O2n67tmi5I"
            title="Vision Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VisionPage;
