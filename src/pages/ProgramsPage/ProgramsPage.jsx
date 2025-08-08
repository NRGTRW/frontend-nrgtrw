import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFitnessPrograms, checkUserAccess } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import WaitlistModal from "../../components/WaitlistModal/WaitlistModal";
import "./ProgramsPage.css";

const ProgramsPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [program, setProgram] = useState(null);
  const [userAccess, setUserAccess] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const contentRefs = useRef({});
  const [waitlistMode, setWaitlistMode] = useState(true); // Set to true to enable waitlist mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsData, accessData] = await Promise.all([
          fetchFitnessPrograms(),
          user ? checkUserAccess() : { accessMap: {}, hasSubscription: false }
        ]);
        
        const currentProgram = programsData.find(p => p.id === parseInt(programId));
        if (!currentProgram) {
          toast.error("Program not found");
          navigate("/fitness");
          return;
        }
        
        setProgram(currentProgram);
        setUserAccess(accessData);
      } catch (error) {
        console.error("Error fetching program data:", error);
        toast.error("Failed to load program");
        navigate("/fitness");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [programId, user, navigate]);

  const userHasAccess = () => {
    // Admin users have access to everything
    if (user?.role && ['ADMIN', 'ROOT_ADMIN'].includes(user.role.trim().toUpperCase())) {
      return true;
    }
    return userAccess.accessMap?.[parseInt(programId)] || userAccess.hasSubscription;
  };

  const parseJsonField = (field) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  // Security: Prevent right-click and text selection on restricted content
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (!userHasAccess() && activeTab !== "overview") {
        e.preventDefault();
        toast.warning("🔒 Content is protected. Purchase to unlock full access.");
      }
    };

    const handleSelectStart = (e) => {
      if (!userHasAccess() && activeTab !== "overview") {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      // Prevent common keyboard shortcuts for copying
      if (!userHasAccess() && activeTab !== "overview") {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 's' || e.key === 'p')) {
          e.preventDefault();
          toast.warning("🔒 Content is protected. Purchase to unlock full access.");
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userHasAccess, activeTab]);

  // Handle tab switching - allow all tabs but show overlay for restricted content
  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
  };

  // Handle payment/subscription redirects
  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login page
      navigate("/login", { 
        state: { 
          redirectTo: `/programs/${programId}`,
          message: "Please log in to purchase this program"
        }
      });
      return;
    }
    
    // Send directly to Stripe checkout
    try {
      const { createCheckoutSession } = await import("../../services/api");
      const stripe = await import("@stripe/stripe-js").then(m => m.loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
      
      const data = await createCheckoutSession({
        userId: user.id,
        type: "fitness_one_time",
        items: [{
          id: parseInt(programId),
          name: program.title,
          description: program.description,
          image: program.image,
          price: program.price,
          quantity: 1
        }]
      });
      
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

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login page
      navigate("/login", { 
        state: { 
          redirectTo: `/programs/${programId}`,
          message: "Please log in to subscribe"
        }
      });
      return;
    }
    
    // Send directly to Stripe checkout
    try {
      const { createCheckoutSession } = await import("../../services/api");
      const stripe = await import("@stripe/stripe-js").then(m => m.loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
      
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

  const handleJoinWaitlist = () => {
    setShowWaitlistModal(true);
  };

  const handleCloseWaitlistModal = () => {
    setShowWaitlistModal(false);
  };

  if (loading) {
    return (
      <div className="programs-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="programs-page">
        <div className="error-container">
          <h2>Program Not Found</h2>
          <button onClick={() => navigate("/fitness")} className="back-button">
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  const equipment = parseJsonField(program.equipment);
  const goals = parseJsonField(program.goals);

  return (
    <div className="programs-page">
      {/* Header Section */}
      <div className="program-header">
        <div className="program-header-content">
          <div className="program-header-left">
            <h1 className="program-title">{program.title}</h1>
            <p className="program-description">{program.description}</p>
            <div className="program-meta">
              {program.duration && (
                <span className="meta-item">
                  <strong>Duration:</strong> {program.duration}
                </span>
              )}
              {/* Removed difficulty level display */}
              {/* Only show price if not in waitlist mode */}
              {!waitlistMode && (
                <span className="meta-item">
                  <strong>Price:</strong> ${program.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="program-header-right">
            {program.image && (
              <img 
                src={program.image} 
                alt={program.title} 
                className="program-header-image"
              />
            )}
          </div>
        </div>
      </div>

      {/* Admin Access Indicator */}
      {user?.role && ['ADMIN', 'ROOT_ADMIN'].includes(user.role.trim().toUpperCase()) && (
  <div className="admin-access-indicator">
    <div className="admin-badge">
      👑 Admin Access - Full Program Content Available
    </div>
  </div>
)}
{/* Purchase and Subscribe Buttons */}
{!userHasAccess() && !waitlistMode && (
  <div className="purchase-buttons">
    <button
      className="purchase-button"
      onClick={handlePurchase}
    >
      Unlock This Program
    </button>
    <button
      className="subscribe-button"
      onClick={handleSubscribe}
    >
      Subscribe for All Access
    </button>
  </div>
)}

{!userHasAccess() && waitlistMode && (
  <div className="purchase-buttons">
    <button
      className="waitlist-button"
      onClick={handleJoinWaitlist}
    >
      📋 Join Waitlist
    </button>
    <button
      className="subscribe-button"
      onClick={handleSubscribe}
    >
      Subscribe for All Access
    </button>
  </div>
)}


      {/* Program Content - Always Show */}
      <div className="program-content">
        {/* Navigation Tabs */}
        <div className="program-tabs">
          <button 
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => handleTabSwitch("overview")}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === "instructions" ? "active" : ""}`}
            onClick={() => handleTabSwitch("instructions")}
          >
            Key Principles {!userHasAccess() && "🔒"}
          </button>
          <button 
            className={`tab-button ${activeTab === "video" ? "active" : ""}`}
            onClick={() => handleTabSwitch("video")}
          >
            Explanation Video {!userHasAccess() && "🔒"}
          </button>
          <button 
            className={`tab-button ${activeTab === "content" ? "active" : ""}`}
            onClick={() => handleTabSwitch("content")}
          >
            Program Content {!userHasAccess() && "🔒"}
          </button>
          {program.pdfUrl && (
            <button 
              className={`tab-button ${activeTab === "pdf" ? "active" : ""}`}
              onClick={() => handleTabSwitch("pdf")}
            >
              Download PDF {!userHasAccess() && "🔒"}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <h3>Program Overview</h3>
              <div className="overview-grid">
                <div className="overview-card">
                  <h4>🎯 Goals</h4>
                  {goals.length > 0 ? (
                    <ul>
                      {goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Goals will be defined in the program content.</p>
                  )}
                </div>
                
                <div className="overview-card">
                  <h4>🏋️ Equipment Needed</h4>
                  {equipment.length > 0 ? (
                    <ul>
                      {equipment.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Equipment requirements will be listed in the instructions.</p>
                  )}
                </div>
                
                <div className="overview-card">
                  <h4>📅 Program Structure</h4>
                  <p><strong>Duration:</strong> {program.duration || "To be determined"}</p>
                  {/* Removed difficulty level display */}
                  <p><strong>Type:</strong> Fitness Program</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "instructions" && (
            <div className="instructions-tab">
              <h3>📋 Key Principles</h3>
              <div className="content-wrapper" ref={el => contentRefs.current.instructions = el}>
                {program.instructions ? (
                  <div className="instructions-content">
                    {program.instructions.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>Instructions are being prepared for this program.</p>
                    <p>Please check back soon or contact support for immediate assistance.</p>
                  </div>
                )}
                {!userHasAccess() && (
                  <div className="content-overlay">
                    <div className="mist-overlay"></div>
                    <div className="lock-message">
                      <div className="lock-icon">🔒</div>
                      <h4>Program Locked</h4>
                      <p>Join the waitlist to get early access when this program launches</p>
                      <button 
                        onClick={() => setShowAccessModal(true)}
                        className="unlock-button"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "video" && (
            <div className="video-tab">
              <h3>🎥 Explanation Video</h3>
              <div className="content-wrapper" ref={el => contentRefs.current.video = el}>
                {program.explanationVideo ? (
                  <div className="video-container">
                    <video
                      src={program.explanationVideo}
                      controls={userHasAccess()}
                      className="explanation-video"
                      poster={program.image}
                      onPlay={(e) => {
                        if (!userHasAccess()) {
                          e.preventDefault();
                          e.target.pause();
                          setShowAccessModal(true);
                        }
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="no-content">
                    <p>Explanation video is being prepared for this program.</p>
                    <p>Please check back soon or refer to the instructions tab.</p>
                  </div>
                )}
                {!userHasAccess() && (
                  <div className="content-overlay">
                    <div className="mist-overlay"></div>
                    <div className="lock-message">
                      <div className="lock-icon">🔒</div>
                      <h4>Program Locked</h4>
                      <p>Join the waitlist to get early access when this program launches</p>
                      <button 
                        onClick={() => setShowAccessModal(true)}
                        className="unlock-button"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="content-tab">
              <h3>📖 Program Content</h3>
              <div className="content-wrapper" ref={el => contentRefs.current.content = el}>
                {program.programText ? (
                  <div className="program-text-content">
                    {program.programText.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>Detailed program content is being prepared.</p>
                    <p>Please check back soon or download the PDF if available.</p>
                  </div>
                )}
                {!userHasAccess() && (
                  <div className="content-overlay">
                    <div className="mist-overlay"></div>
                    <div className="lock-message">
                      <div className="lock-icon">🔒</div>
                      <h4>Program Locked</h4>
                      <p>Join the waitlist to get early access when this program launches</p>
                      <button 
                        onClick={() => setShowAccessModal(true)}
                        className="unlock-button"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "pdf" && program.pdfUrl && (
            <div className="pdf-tab">
              <h3>📄 Program PDF</h3>
              <div className="content-wrapper" ref={el => contentRefs.current.pdf = el}>
                <div className="pdf-container">
                  <p>Download the complete program guide:</p>
                  <button 
                    onClick={() => {
                      if (userHasAccess()) {
                        window.open(program.pdfUrl, '_blank');
                      } else {
                        setShowAccessModal(true);
                      }
                    }}
                    className="download-pdf-button"
                  >
                    📥 Download PDF
                  </button>
                  <div className="pdf-note">
                    <p><strong>Note:</strong> We recommend downloading your PDF now. Once the program is updated, your original version may no longer be available!</p>
                  </div>
                </div>
                {!userHasAccess() && (
                  <div className="content-overlay">
                    <div className="mist-overlay"></div>
                    <div className="lock-message">
                      <div className="lock-icon">🔒</div>
                      <h4>Program Locked</h4>
                      <p>Join the waitlist to get early access when this program launches</p>
                      <button 
                        onClick={() => setShowAccessModal(true)}
                        className="unlock-button"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Access Modal */}
      {showAccessModal && (
        <div className="access-modal-overlay" onClick={() => setShowAccessModal(false)}>
          <div className="access-modal" onClick={(e) => e.stopPropagation()}>
            <div className="access-modal-content">
              <div className="modal-header">
                <h2>🔒 Program Currently in Waitlist Mode</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAccessModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>This program is currently in waitlist mode. Join our exclusive waitlist to get early access when it becomes available!</p>
                <div className="access-options">
                  <div className="access-option">
                    <h4>📋 Join Waitlist</h4>
                    <p>Be the first to know when this program launches</p>
                    <button 
                      onClick={() => {
                        setShowAccessModal(false);
                        handleJoinWaitlist();
                      }}
                      className="waitlist-button"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%'
                      }}
                    >
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={handleCloseWaitlistModal}
        program={program}
      />

      {/* Back Button */}
      <div className="back-section">
        <button onClick={() => navigate("/fitness")} className="back-button">
          ← Back to Programs
        </button>
      </div>
    </div>
  );
};

export default ProgramsPage; 