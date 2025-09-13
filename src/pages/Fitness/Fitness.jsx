// Fitness.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Fitness.css";
import styles from "./Fitness.module.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  createCheckoutSession,
  fetchFitnessPrograms,
  checkWaitlistStatus,
  checkUserAccess,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import WaitlistModal from "../../components/WaitlistModal/WaitlistModal";
import RequestModal from "../../components/RequestModal/RequestModal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Fitness = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [userAccess, setUserAccess] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [hoveredProgramId, setHoveredProgramId] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [selectedProgramForWaitlist, setSelectedProgramForWaitlist] =
    useState(null);
  const [isOnGlobalWaitlist, setIsOnGlobalWaitlist] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const authContext = useAuth();
  const user = authContext?.user;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [programsData, accessData] = await Promise.all([
        fetchFitnessPrograms(),
        user ? checkUserAccess() : { accessMap: {}, hasSubscription: false },
      ]);
      setPrograms(programsData);
      setUserAccess(accessData);
    } catch (error) {
      console.error("Error fetching fitness data:", error);
      setError("Failed to load fitness programs. Please try again.");
      toast.error("Failed to load fitness programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    const checkGlobalWaitlistStatus = async () => {
      if (user && user.email) {
        try {
          const response = await checkWaitlistStatus(user.email);
          setIsOnGlobalWaitlist(!!response.isOnWaitlist);
        } catch (error) {
          console.error("Error checking global waitlist status:", error);
          toast.error("Failed to check global waitlist status.");
        }
      }
    };
    checkGlobalWaitlistStatus();
  }, [user]);

  const userHasAccess = (programId) => {
    if (
      user?.role &&
      ["ADMIN", "ROOT_ADMIN"].includes(user.role.trim().toUpperCase())
    ) {
      return true;
    }
    return userAccess.accessMap?.[programId] || userAccess.hasSubscription;
  };

  const handleStripeCheckout = async (program) => {
    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/fitness",
          message: "Please log in to purchase this program",
        },
      });
      return;
    }

    try {
      const data = await createCheckoutSession({
        userId: user.id,
        type: "fitness_one_time",
        items: [
          {
            id: program.id,
            name: program.title,
            description: program.description,
            image: program.image,
            price: program.price,
            quantity: 1,
          },
        ],
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        toast.error("Failed to redirect to payment.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed. Please try again later.");
    }
  };

  const handleStripeSubscription = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/fitness",
          message: "Please log in to subscribe",
        },
      });
      return;
    }

    try {
      const data = await createCheckoutSession({
        userId: user.id,
        type: "fitness_subscription",
        subscription: {
          name: "All Access Fitness Subscription",
          description: "Access to all fitness programs and future content",
          price: 100,
          interval: "month",
        },
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        toast.error("Failed to redirect to payment.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed. Please try again later.");
    }
  };

  const handleDownloadPDF = (program) => {
    if (program.pdfUrl) {
      window.open(program.pdfUrl, "_blank");
    } else {
      toast.error("PDF not available for this program.");
    }
  };

  const handleJoinWaitlist = (program) => {
    setSelectedProgramForWaitlist(program);
    setShowWaitlistModal(true);
  };

  const handleCloseWaitlistModal = () => {
    setShowWaitlistModal(false);
    setSelectedProgramForWaitlist(null);
  };

  if (loading) {
    return (
      <div className="fitness-page">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading fitness programs...
        </div>
      </div>
    );
  }

  return (
    <div className="fitness-page dark-fitness-bg">
      {/* Video Placeholder */}
      <div className="fitness-video-placeholder">
        <div className="fitness-video-container">
          <div className="fitness-video-text">
            Transform Your Body, Transform Your Life
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <section className="program-cards">
          {[1, 2, 3].map((index) => (
            <div key={index} className="program-card skeleton-card">
              <div className="skeleton-image"></div>
              <div className="program-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="error-section">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={fetchData}>
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* Programs Section */}
      {!loading && !error && (
        <section className="program-cards">
          {programs.map((program) => (
            <div
              key={program.id}
              className="program-card"
              onMouseEnter={() => setHoveredProgramId(program.id)}
              onMouseLeave={() => setHoveredProgramId(null)}
            >
              <div
                className="program-image-container"
                style={{ position: "relative" }}
              >
                <img
                  src={program.image}
                  alt={program.title}
                  style={{
                    display: hoveredProgramId === program.id ? "none" : "block",
                    width: "100%",
                  }}
                />
                {hoveredProgramId === program.id && program.video && (
                  <video
                    src={program.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="program-preview-video"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setActiveProgram(program);
                      setShowOverview(false);
                    }}
                  />
                )}
              </div>
              <div className="program-info">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                {!program.waitlistMode && (
                  <div
                    style={{
                      fontSize: "1.05rem",
                      color: "var(--fitness-btn)",
                      opacity: 0.82,
                      margin: "6px 0",
                      fontWeight: 500,
                    }}
                  >
                    ${program.price.toFixed(2)}
                  </div>
                )}
                {/* <button
                className={styles.fitnessProgramBtn}
                onClick={() => {
                  setActiveProgram(program);
                  setShowOverview(true);
                }}
              >
                Program Overview
              </button> */}
                <button
                  className="view-full-program-btn"
                  onClick={() => navigate(`/programs/${program.id}`)}
                >
                  View Full Program
                </button>
                {program.waitlistMode ? (
                  <button
                    className="waitlist-btn"
                    onClick={() => handleJoinWaitlist(program)}
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      marginTop: "8px",
                      width: "100%",
                    }}
                  >
                    📋 Join Waitlist
                  </button>
                ) : (
                  <button
                    className={styles.fitnessProgramBtn}
                    onClick={() => handleStripeCheckout(program)}
                    style={{ marginTop: "8px", width: "100%" }}
                  >
                    🔓 Get Program
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 1-on-1 Consultation Booking Section */}
      <section className="consultation-section">
        <div className="consultation-container">
          <div className="consultation-content">
            <h2 className="consultation-title">
              Need a <span className="accent-text">Personal Touch</span>?
            </h2>
            <p className="consultation-description">
              Get a custom fitness regime tailored specifically to your goals,
              lifestyle, and preferences. Book a 1-on-1 consultation and let's
              build your perfect program together.
            </p>
            <div className="consultation-features">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Personalized Goals Assessment</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📋</div>
                <span>Custom Program Design</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💪</div>
                <span>Form & Technique Review</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <span>Ongoing Support</span>
              </div>
            </div>
            <button
              className="consultation-btn"
              onClick={() => setShowConsultationModal(true)}
            >
              Book Your 1-on-1 Consultation
            </button>
          </div>
        </div>
      </section>

      {activeProgram && showOverview && (
        <div
          className="program-modal"
          onClick={() => navigate(`/programs/${activeProgram.id}`)}
        >
          <div
            className="modal-content fitness-overview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{activeProgram.title}</h2>
            <p>{activeProgram.description}</p>
            {activeProgram.programText && (
              <div
                style={{
                  whiteSpace: "pre-line",
                  margin: "16px 0",
                  color: "#ffe067",
                  fontFamily: "inherit",
                  fontSize: "1.05rem",
                }}
              >
                {activeProgram.programText}
              </div>
            )}
            {userHasAccess(activeProgram.id) ? (
              <>
                {user?.role &&
                  ["ADMIN", "ROOT_ADMIN"].includes(
                    user.role.trim().toUpperCase(),
                  ) && (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        marginBottom: "16px",
                        textAlign: "center",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      👑 Admin Access - Full Program Available
                    </div>
                  )}
                <button
                  className="fitness-modal-close-btn"
                  onClick={() => handleDownloadPDF(activeProgram)}
                >
                  Download/View PDF
                </button>
                <div
                  style={{
                    color: "var(--fitness-btn)",
                    marginTop: 12,
                    fontWeight: 600,
                  }}
                >
                  <span>
                    We strongly recommend downloading your PDF now. Once the
                    program is updated, your original version may no longer be
                    available!
                  </span>
                </div>
              </>
            ) : (
              <>
                {activeProgram.waitlistMode ? (
                  <>
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        textAlign: "center",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                      }}
                    >
                      🔒 Program Currently in Waitlist Mode
                    </div>
                    <button
                      className="fitness-modal-close-btn"
                      onClick={() => handleJoinWaitlist(activeProgram)}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      📋 Join Waitlist for Early Access
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="fitness-modal-close-btn"
                      onClick={() => handleStripeCheckout(activeProgram)}
                    >
                      Unlock Full Program
                    </button>
                    <button
                      className="fitness-modal-close-btn"
                      onClick={handleStripeSubscription}
                    >
                      Subscribe for All Access
                    </button>
                  </>
                )}
              </>
            )}
            <button
              className="fitness-modal-close-btn"
              style={{ marginTop: 24 }}
              onClick={() => {
                setActiveProgram(null);
                setShowOverview(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeProgram && !showOverview && (
        <div className="program-modal" onClick={() => setActiveProgram(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{activeProgram.title}</h2>
            <p>{activeProgram.description}</p>
            {activeProgram.video && (
              <video
                src={activeProgram.video}
                controls
                autoPlay
                style={{
                  width: "100%",
                  maxWidth: 480,
                  borderRadius: 12,
                  margin: "20px 0",
                }}
              />
            )}
            <button
              onClick={() => setActiveProgram(null)}
              className="fitness-modal-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={handleCloseWaitlistModal}
        program={selectedProgramForWaitlist}
      />

      <RequestModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
      />
    </div>
  );
};

export default Fitness;
