import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NRGLandingPage.css";
import RequestModal from "../../components/RequestModal/RequestModal";
import TikTokFeed from "../../components/TikTokFeed/TikTokFeed";
// import FeatureHighlights from "../../components/MarketingComponents/FeatureHighlights";
import EnhancedTestimonials from "../../components/MarketingComponents/EnhancedTestimonials";
import { useAuth } from "../../context/AuthContext";

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
const landingPageMobileFirst = S3_BASE + "landingPageMobileFirst.png";
const categories = [
  {
    title: "Fitness",
    image: S3_BASE + "Fitness.jpg",
    path: "/fitness",
    glow: "fitness-glow",
  },
  {
    title: "Tech",
    image: S3_BASE + "Tech.webp",
    path: "/tech",
    glow: "tech-glow",
  },
  {
    title: "Clothing",
    image: S3_BASE + "Reflection%20Layer_upclose.webp",
    path: "/clothing",
    glow: "clothing-glow",
  },
  {
    title: "Vision",
    image: S3_BASE + "vision.png",
    path: "/vision",
    glow: "vision-glow",
  },
];

const typingText =
  "I don't just build — I master. Everything I do is forged with purpose, edge, and soul. This is growth at its rawest. Vision at its sharpest.";

const NRGLandingPage = () => {
  const [typedText, setTypedText] = useState("");
  const [isDoneTyping, setIsDoneTyping] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const authContext = useAuth();
  const user = authContext?.user;
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
    <>
      {/* Hero Section */}
      <section
        className="nrg-hero"
        // style={{ backgroundImage: `url(${landingPageMobileFirst})` }}
        style={{ backgroundImage: `url()` }}
      >
        {/* Overlay removed: only background image and content remain */}
        <div className="nrg-hero-content">
          <h1 className="nrg-slogan">
            IF YOU&apos;RE READY TO <span>PAY</span>,<br />
            I&apos;LL FIND A <span>WAY</span>.
          </h1>

          <p className={`nrg-sub typing-text ${isDoneTyping ? "done" : ""}`}>
            {typedText}
          </p>

          {/* Video Placeholder */}
          <div className="hero-video-placeholder">
            <div className="video-container">
              <div className="video-placeholder-content">
                <div className="play-button">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </div>
                <p className="video-text">Quick walktrough</p>
                <p className="video-subtitle">Watch to learn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      {/* <FeatureHighlights /> */}

      {/* Service Categories Section */}
      <section className="nrg-sections" style={{ background: "var(--nrg-bg)" }}>
        <div className="sections-header">
          <h2>Explore My Services</h2>
          <p className="sections-subtitle-contrast">
            Choose your path to transformation
          </p>
        </div>
        <div className="categories-grid-wrapper">
          <div className="categories-grid">
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
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      {/* <EnhancedTestimonials /> */}

      {/* TikTok Feed Section */}
      <TikTokFeed />

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-container">
          <h2>Ready to Transform Your Life?</h2>
          <p>Join the elite who choose excellence over mediocrity</p>
          <div className="cta-buttons">
            <button
              className="primary-cta-btn fitness-btn"
              onClick={() => navigate("/fitness")}
            >
              <span className="btn-content">Explore Fitness</span>
            </button>
            <button
              className="primary-cta-btn clothing-btn"
              onClick={() => navigate("/clothing")}
            >
              <span className="btn-content">Explore Clothing</span>
            </button>
          </div>
          <button
            className="secondary-cta-btn request-btn"
            style={{ marginTop: "2rem" }}
            onClick={() => {
              if (user) {
                setShowRequestModal(true);
              } else {
                navigate("/login", { state: { from: "/" } });
              }
            }}
          >
            Make a Custom Request (Anything You Need)
          </button>
        </div>
      </section>

      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </>
  );
};

export default NRGLandingPage;
