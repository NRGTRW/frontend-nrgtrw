import React, { useState } from "react";
import "./Fitness.css";
import styles from "./Fitness.module.css";

const programs = [
  {
    id: 1,
    title: "Shredded in 6 Weeks",
    description: "Hypertrophy-focused fat loss program with cardio & nutrition add-ons.",
    image: "/shred6.jpg",
  },
  {
    id: 2,
    title: "Precision Growth",
    description: "Gain with control. Maintain leanness while adding clean muscle.",    
    image: "/precisiongrowth.jpg",
  },
  {
    id: 3,
    title: "Aesthetic Push/Pull/Legs",
    description: "Balance, symmetry, and density. Advanced 6-day split.",
    image: "/ppl.jpg",
  },
];

const Fitness = () => {
  const [activeProgram, setActiveProgram] = useState(null);

  return (
    <div className="fitness-page">
      <section className="fitness-video-placeholder">
        <div className="video-container">
          <div className="video-text">🎥 Intro Video Coming Soon</div>
        </div>
      </section>

      <section className="program-cards">
        {programs.map((program) => (
          <div key={program.id} className="program-card">
            <img src={program.image} alt={program.title} />
            <div className="program-info">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <button className={styles.fitnessProgramBtn} onClick={() => setActiveProgram(program)}>
                Program Overview
              </button>
            </div>
          </div>
        ))}
      </section>

      {activeProgram && (
        <div className="program-modal">
          <div className="modal-content">
            <h2>{activeProgram.title}</h2>
            <p>{activeProgram.description}</p>
            <button onClick={() => setActiveProgram(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fitness;
