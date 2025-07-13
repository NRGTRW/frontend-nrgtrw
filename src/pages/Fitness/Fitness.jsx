import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Fitness.css";
import styles from "./Fitness.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession, fetchFitnessPrograms, checkUserAccess } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

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
    <div className="fitness-page">
      <section className="fitness-video-placeholder">
        <div className="fitness-video-container">
          <div className="fitness-video-text">🎥 Intro Video Coming Soon</div>
        </div>
      </section>

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
              {/* Subtle price display */}
              <div style={{ fontSize: '1.05rem', color: 'var(--fitness-btn)', opacity: 0.82, margin: '6px 0 0 0', fontWeight: 500, letterSpacing: '0.01em' }}>
                ${program.price.toFixed(2)}
              </div>
              <button className={styles.fitnessProgramBtn} onClick={() => { setActiveProgram(program); setShowOverview(true); }}>
                Program Overview
              </button>
              <button 
                className="view-full-program-btn"
                onClick={() => navigate(`/programs/${program.id}`)}
              >
                View Full Program
              </button>
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
                <button className="fitness-modal-close-btn" onClick={() => handleStripeCheckout(activeProgram)}>
                  Unlock Full Program
                </button>
                <button className="fitness-modal-close-btn" onClick={handleStripeSubscription}>
                  Subscribe for All Access
                </button>
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
    </div>
  );
};

export default Fitness;
