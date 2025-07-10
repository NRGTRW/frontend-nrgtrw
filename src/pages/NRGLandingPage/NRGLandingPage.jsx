import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NRGLandingPage.css";
import landingPageMobileFirst from "/landingPageMobileFirst.png";

const categories = [
  { title: "Fitness", image: "/Fitness.jpg", path: "/fitness", glow: "fitness-glow" },
  { title: "Tech", image: "/Tech.webp", path: "/tech", glow: "tech-glow" },
  { title: "Clothing", image: "/Clothing.jpg", path: "/clothing", glow: "clothing-glow" },
  { title: "Designs", image: "/BlackCroppedTurtuleneckHover.webp", path: "/designs", glow: "designs-glow" },
  { title: "Vision", image: "/vision.png", path: "/vision", glow: "vision-glow" },
];

const typingText =
  "I don’t just build — I master. Everything I do is forged with purpose, edge, and soul. This is growth at its rawest. Vision at its sharpest.";

const NRGLandingPage = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [isDoneTyping, setIsDoneTyping] = useState(false);

  useEffect(() => {
    console.log("NRGLandingPage loaded at", window.location.pathname);
    let index = 0;
    const interval = setInterval(() => {
      if (index >= typingText.length) {
        clearInterval(interval);
        setIsDoneTyping(true);
        return;
      }

      const nextChar = typingText.charAt(index);
      setTypedText((prev) => prev + nextChar);
      index++;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="nrg-hero"
      style={{ backgroundImage: `url(${landingPageMobileFirst})` }}
    >
      <div className="nrg-hero-overlay" />
      <div className="nrg-hero-content">
        <h1 className="nrg-slogan">
          IF YOU&apos;RE READY TO <span>PAY</span>,<br />I&apos;LL FIND A <span>WAY</span>.
        </h1>

        <p className={`nrg-sub typing-text ${isDoneTyping ? "done" : ""}`}>
          {typedText}
        </p>

        <div className="nrg-actions">
          <button className="secondary-btn">Make a Request</button>
        </div>

        <section className="nrg-sections">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className={`nrg-tile ${cat.glow}`}
              style={{ backgroundImage: `url(${cat.image})` }}
              onClick={() => navigate(cat.path)}
            >
              <div className="nrg-tile-overlay">
                <h3>{cat.title}</h3>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
};

export default NRGLandingPage;
