import React, { useState } from "react";
import "./Tech.css";
import styles from "./Tech.module.css";

const techProjects = [
  {
    id: 1,
    title: "Main Site",
    description: "Return to the main NRG site.",
    image: "/Tech.webp",
    type: "redirect",
    url: "/"
  },
  {
    id: 2,
    title: "Legacy Project 1",
    description: "Preview one of my previous tech projects.",
    image: "/Tech.webp",
    type: "iframe",
    url: "https://example.com/project1" // Replace with actual URL later
  },
  {
    id: 3,
    title: "Legacy Project 2",
    description: "Preview another previous tech project.",
    image: "/Tech.webp",
    type: "iframe",
    url: "https://example.com/project2" // Replace with actual URL later
  }
];

const Tech = () => {
  const [activeProject, setActiveProject] = useState(null);

  const handleCardClick = (project) => {
    if (project.type === "redirect") {
      window.location.href = project.url;
    } else {
      setActiveProject(project);
    }
  };

  return (
    <div className="tech-page">
      <section className="tech-video-placeholder">
        <div className="video-container">
          <div className="video-text">🎥 Tech Intro Video Coming Soon</div>
        </div>
      </section>
      <section className="tech-cards">
        {techProjects.map((project) => (
          <div key={project.id} className="tech-card">
            <img src={project.image} alt={project.title} />
            <div className="tech-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <button className={styles.techProjectBtn} onClick={() => handleCardClick(project)}>
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
              height="500px"
              style={{ border: "none", borderRadius: "12px", background: "#111" }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
            <button onClick={() => setActiveProject(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tech; 