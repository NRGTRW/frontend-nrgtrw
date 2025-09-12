import React, { useState } from "react";
import "./Tech.css";
import styles from "./Tech.module.css";

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
const techProjects = [
  {
    id: 1,
    title: "Main Site",
    description: "Return to the main NRG site.",
    image: S3_BASE + "Tech.webp",
    type: "redirect",
    url: "/clothing-details",
  },
  {
    id: 2,
    title: "KING-S Project",
    description: "Interactive portfolio website with animations and modern UI.",
    image: "/kings-crown.png",
    type: "iframe",
    url: "/kings-project/HTML/home_page.html",
  },
  {
    id: 3,
    title: "Components Library",
    description: "Modern React components library with design system and generator tools.",
    image: "/Library/dist/webDev.webp",
    type: "redirect",
    url: "/library",
  },
  {
    id: 4,
    title: "Legacy Project 1",
    description: "Preview one of my previous tech projects.",
    image: S3_BASE + "Tech.webp",
    type: "iframe",
    url: "https://example.com/project1", // Replace with actual URL later
  },
];

const Tech = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size on resize
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (project) => {
    if (project.type === "redirect") {
      window.location.href = project.url;
    } else {
      setActiveProject(project);
    }
  };

  const handleIframeLoad = (event) => {
    // Handle iframe load events if needed
    console.log("Iframe loaded:", event.target.src);
  };

  return (
    <div className="tech-page">
      <section className="tech-video-placeholder">
        <div className="tech-video-container">
          <div className="video-text">🎥 Intro Video Coming Soon</div>
        </div>
      </section>
      <section className="tech-cards">
        {techProjects.map((project) => (
          <div key={project.id} className="tech-card">
            {project.type === "iframe" ? (
              <div style={{ position: "relative" }}>
                <iframe
                  src={project.url}
                  title={project.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    border: "none",
                    borderRadius: "18px 18px 0 0",
                    background: "#212121",
                    pointerEvents: "none",
                    transform: "scale(1.1)",
                    transformOrigin: "center center"
                  }}
                  sandbox="allow-scripts allow-forms allow-popups allow-modals"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div 
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    cursor: "pointer",
                    borderRadius: "18px 18px 0 0"
                  }}
                  onClick={() => handleCardClick(project)}
                />
              </div>
            ) : (
              <img src={project.image} alt={project.title} />
            )}
            <div className="tech-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <button
                className={styles.techProjectBtn}
                onClick={() => handleCardClick(project)}
              >
                {project.type === "redirect" ? "Go" : "Preview"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {activeProject && activeProject.type === "iframe" && (
        <div className="tech-modal">
          <div className="modal-content">
            <h2>{activeProject.title}</h2>
            <iframe
              src={activeProject.url}
              title={activeProject.title}
              width="100%"
              height={windowSize.width < 768 ? "400px" : windowSize.width < 1200 ? "600px" : "80vh"}
              style={{
                border: "none",
                borderRadius: "12px",
                background: "#111",
                minHeight: windowSize.width < 480 ? "300px" : windowSize.width < 768 ? "400px" : "600px",
              }}
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              referrerPolicy="no-referrer"
              allowFullScreen
              onLoad={handleIframeLoad}
            />
            <button onClick={() => setActiveProject(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tech;
