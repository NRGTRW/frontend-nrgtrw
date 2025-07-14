import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Fitness.css";
import styles from "./Fitness.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession, fetchFitnessPrograms, checkWaitlistStatus, checkUserAccess } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import WaitlistModal from "../../components/WaitlistModal/WaitlistModal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";

const Fitness = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [userAccess, setUserAccess] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeProgram, setActiveProgram] = useState(null);
  const [hoveredProgramId, setHoveredProgramId] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [selectedProgramForWaitlist, setSelectedProgramForWaitlist] = useState(null);
  const [waitlistMode, setWaitlistMode] = useState(true); // Set to true to enable waitlist mode
  const [isOnGlobalWaitlist, setIsOnGlobalWaitlist] = useState(false); // New state for global waitlist status
  const { user } = useAuth();

  // Fetch programs and user access on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsData, accessData] = await Promise.all([
          fetchFitnessPrograms(),
          user ? checkUserAccess() : { accessMap: {}, hasSubscription: false }
        ]);
        
        setPrograms(programsData);
        setUserAccess(accessData);
      } catch (error) {
        console.error("Error fetching fitness data:", error);
        toast.error("Failed to load fitness programs");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Check if user has access to a specific program
  const userHasAccess = (programId) => {
    // Admin users have access to everything
    if (user?.role && ['ADMIN', 'ROOT_ADMIN'].includes(user.role.trim().toUpperCase())) {
      return true;
    }
    return userAccess.accessMap?.[programId] || userAccess.hasSubscription;
  };

  // Stripe checkout for one-time purchase
  const handleStripeCheckout = async (program) => {
    if (!user) {
      // Redirect to login page
      navigate("/login", { 
        state: { 
          redirectTo: "/fitness",
          message: "Please log in to purchase this program"
        }
      });
      return;
    }
    
    // Send directly to Stripe checkout
    try {
      const data = await createCheckoutSession({
        userId: user.id,
        type: "fitness_one_time",
        items: [{
          id: program.id,
          name: program.title,
          description: program.description,
          image: program.image,
          price: program.price,
          quantity: 1
        }]
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

  // Stripe checkout for subscription
  const handleStripeSubscription = async () => {
    if (!user) {
      // Redirect to login page
      navigate("/login", { 
        state: { 
          redirectTo: "/fitness",
          message: "Please log in to subscribe"
        }
      });
      return;
    }
    
    // Send directly to Stripe checkout
    try {
      const data = await createCheckoutSession({
        userId: user.id,
        type: "fitness_subscription",
        subscription: {
          name: "All Access Fitness Subscription",
          description: "Access to all fitness programs and future content",
          price: 100, // Monthly subscription price
          interval: "month"
        }
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

  // Replace handleJoinWaitlist with a simple modal open
  const handleJoinWaitlist = (program) => {
    setSelectedProgramForWaitlist(program);
    setShowWaitlistModal(true);
  };

  const handleCloseWaitlistModal = () => {
    setShowWaitlistModal(false);
    setSelectedProgramForWaitlist(null);
  };

  // Fetch global waitlist status on component mount
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

  if (loading) {
    return (
      <div className="fitness-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading fitness programs...
        </div>
      </div>
    );
  }

  return (
    <div className="fitness-page dark-fitness-bg">
      <section className="fitness-video-placeholder">
        <div className="fitness-video-container">
          <div className="fitness-video-text">🎥 Intro Video Coming Soon</div>
        </div>
      </section>

      {/* Custom Offer Card */}
      <div className="custom-offer-card" style={{ marginTop: '32px' }}>
        <div className="custom-offer-overlay"></div>
        <div className="custom-offer-content">
          <div className="custom-offer-badge">
            <span style={{ color: '#e0c88f', fontFamily: 'Playfair Display, Georgia, serif' }}>Premium Service</span>
          </div>
          <h2 className="custom-offer-title">1:1 Call</h2>
          <ul className="custom-offer-bullets">
            <li><strong>Real conversation</strong> — direct, focused, and honest</li>
            <li><strong>Plan built for your</strong> — goals, routine, lifestyle</li>
          </ul>
          <button 
            className="custom-offer-button"
            onClick={() => {
              window.open('mailto:nrgoranov@gmail.com?subject=Coaching Call Inquiry', '_blank');
            }}
          >
            {/* <span className="button-icon" aria-label="Phone">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.654 2.328a2.291 2.291 0 0 1 3.104-.196l1.2.96c.7.56.86 1.57.36 2.28l-.7.98a.75.75 0 0 0 .09.97l2.1 2.1a.75.75 0 0 0 .97.09l.98-.7c.71-.5 1.72-.34 2.28.36l.96 1.2a2.291 2.291 0 0 1-.196 3.104l-1.02.85c-.82.68-2.04.62-2.8-.14l-4.1-4.1c-.76-.76-.82-1.98-.14-2.8l.85-1.02Z" stroke="#e0c88f" strokeWidth="1.5" fill="none"/>
              </svg>
            </span> */}
            <span className="button-text">Book Your Call</span>
            <span className="button-arrow">→</span>
          </button>
        </div>
      </div>

      <section className="program-cards">
        {programs.map((program) => (
          <div
            key={program.id}
            className="program-card"
            onMouseEnter={() => setHoveredProgramId(program.id)}
            onMouseLeave={() => setHoveredProgramId(null)}
          >
            <div className="program-image-container" style={{ position: 'relative' }}>
              <img
                src={program.image}
                alt={program.title}
                style={{ display: hoveredProgramId === program.id ? 'none' : 'block', width: '100%' }}
              />
              {hoveredProgramId === program.id && program.video && (
                <video
                  src={program.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="program-preview-video"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => { setActiveProgram(program); setShowOverview(false); }}
                />
              )}
            </div>
            <div className="program-info">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              {/* Only show price when not in waitlist mode */}
              {!waitlistMode && (
                <div style={{ fontSize: '1.05rem', color: 'var(--fitness-btn)', opacity: 0.82, margin: '6px 0 0 0', fontWeight: 500, letterSpacing: '0.01em' }}>
                  ${program.price.toFixed(2)}
                </div>
              )}
              <button className={styles.fitnessProgramBtn} onClick={() => { setActiveProgram(program); setShowOverview(true); }}>
                Program Overview
              </button>
              <button 
                className="view-full-program-btn"
                onClick={() => navigate(`/programs/${program.id}`)}
              >
                View Full Program
              </button>
              {waitlistMode ? (
                isOnGlobalWaitlist ? (
                  <div className="waitlist-info-message" style={{ color: '#ffe067', fontWeight: 600, marginTop: 12, textAlign: 'center' }}>
                    You're on the waitlist. You'll be notified when a program comes out.
                  </div>
                ) : (
                  <button 
                    className="waitlist-btn"
                    onClick={() => handleJoinWaitlist(program)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: '8px',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    📋 Join Waitlist
                  </button>
                )
              ) : (
                <button 
                  className="view-full-program-btn"
                  onClick={() => navigate(`/programs/${program.id}`)}
                  style={{
                    background: 'linear-gradient(135deg, #e6b800 0%, #d4a017 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '8px',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(230, 184, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  View Full Program
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Program Overview Modal */}
      {activeProgram && showOverview && (
        <div className="program-modal" onClick={() => { setActiveProgram(null); setShowOverview(false); }}>
          <div className="modal-content fitness-overview-modal" onClick={e => e.stopPropagation()}>
            <h2>{activeProgram.title}</h2>
            <p>{activeProgram.description}</p>
            {/* Access logic */}
            {userHasAccess(activeProgram.id) ? (
              <>
                {/* Admin Access Indicator */}
                {user?.role && ['ADMIN', 'ROOT_ADMIN'].includes(user.role.trim().toUpperCase()) && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    marginBottom: '16px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    👑 Admin Access - Full Program Available
                  </div>
                )}
                <button className="fitness-modal-close-btn" onClick={() => handleDownloadPDF(activeProgram)}>
                  Download/View PDF
                </button>
                <div style={{ color: 'var(--fitness-btn)', marginTop: 12, fontWeight: 600 }}>
                  <span>We strongly recommend downloading your PDF now. Once the program is updated, your original version may no longer be available!</span>
                </div>
              </>
            ) : (
              <>
                {waitlistMode ? (
                  <>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      marginBottom: '16px',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}>
                      🔒 Program Currently in Waitlist Mode
                    </div>
                    <button 
                      className="fitness-modal-close-btn" 
                      onClick={() => handleJoinWaitlist(activeProgram)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      📋 Join Waitlist for Early Access
                    </button>
                  </>
                ) : (
                  <>
                    <button className="fitness-modal-close-btn" onClick={() => handleStripeCheckout(activeProgram)}>
                      Unlock Full Program
                    </button>
                    <button className="fitness-modal-close-btn" onClick={handleStripeSubscription}>
                      Subscribe for All Access
                    </button>
                  </>
                )}
              </>
            )}
            <button className="fitness-modal-close-btn" style={{ marginTop: 24 }} onClick={() => { setActiveProgram(null); setShowOverview(false); }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Modal (existing) */}
      {activeProgram && !showOverview && (
        <div className="program-modal" onClick={() => setActiveProgram(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{activeProgram.title}</h2>
            <p>{activeProgram.description}</p>
            {activeProgram.video && (
              <video
                src={activeProgram.video}
                controls
                autoPlay
                style={{ width: '100%', maxWidth: 480, borderRadius: 12, margin: '20px 0' }}
              />
            )}
            <button onClick={() => setActiveProgram(null)} className="fitness-modal-close-btn">Close</button>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={handleCloseWaitlistModal}
        program={selectedProgramForWaitlist}
      />
    </div>
  );
};

export default Fitness;
