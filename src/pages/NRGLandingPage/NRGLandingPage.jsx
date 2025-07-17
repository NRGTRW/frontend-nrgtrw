import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NRGLandingPage.css";
import RequestModal from "../../components/RequestModal/RequestModal";
import { useAuth } from "../../context/AuthContext";

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
const landingPageMobileFirst = S3_BASE + "landingPageMobileFirst.png";
const categories = [
  { title: "Fitness", image: S3_BASE + "Fitness.jpg", path: "/fitness", glow: "fitness-glow" },
  { title: "Tech", image: S3_BASE + "Tech.webp", path: "/tech", glow: "tech-glow" },
  // { title: "Clothing", image: S3_BASE + "Reflection_Layer_upclose.webp", path: "/clothing", glow: "clothing-glow" },
  { title: "Clothing", image: S3_BASE + "Clothing.jpg", path: "/clothing", glow: "clothing-glow" },
  { title: "Designs", image: S3_BASE + "BlackCroppedTurtuleneckHover.webp", path: "/designs", glow: "designs-glow" },
  { title: "Vision", image: S3_BASE + "vision.png", path: "/vision", glow: "vision-glow" },
];

const typingText =
  "I don’t just build — I master. Everything I do is forged with purpose, edge, and soul. This is growth at its rawest. Vision at its sharpest.";

const NRGLandingPage = () => {
  const [typedText, setTypedText] = useState("");
  const [isDoneTyping, setIsDoneTyping] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
          <button
            className="secondary-btn"
            onClick={() => {
              if (user) {
                setShowRequestModal(true);
              } else {
                navigate("/login", { state: { from: "/" } });
              }
            }}
          >
            Make a Request
          </button>
        </div>
        <RequestModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />

        <section className="nrg-sections">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.path}
              className={`nrg-tile ${cat.glow}`}
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="nrg-tile-overlay">
                <h3>{cat.title}</h3>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </section>
  );
};

export default NRGLandingPage;
