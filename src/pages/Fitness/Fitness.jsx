import React, { useState } from "react";
import "./Fitness.css";
import styles from "./Fitness.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
const programs = [
  {
    id: 1,
    title: "Shredded in 6 Weeks",
    description: "Hypertrophy-focused fat loss program with cardio & nutrition add-ons.",
    image: S3_BASE + "shred6.jpg",
    video: S3_BASE + "shred6.mp4", // Placeholder video
    priceId: "price_xxx_shred6", // TODO: Replace with real Stripe price ID
    pdfUrl: S3_BASE + "pdfs/shred6.pdf", // TODO: Replace with real PDF URL
    price: 50,
  },
  {
    id: 2,
    title: "Precision Growth",
    description: "Gain with control. Maintain leanness while adding clean muscle.",    
    image: S3_BASE + "precisiongrowth.jpg",
    video: S3_BASE + "precisiongrowth.mp4", // Placeholder video
    priceId: "price_xxx_precision", // TODO: Replace with real Stripe price ID
    pdfUrl: S3_BASE + "pdfs/precisiongrowth.pdf", // TODO: Replace with real PDF URL
    price: 50,
  },
  {
    id: 3,
    title: "Aesthetic Push/Pull/Legs",
    description: "Balance, symmetry, and density. Advanced 6-day split.",
    image: S3_BASE + "ppl.jpg",
    video:S3_BASE + "ppl.mp4", 
    priceId: "price_xxx_ppl", // TODO: Replace with real Stripe price ID
    pdfUrl: S3_BASE + "pdfs/ppl.pdf", // TODO: Replace with real PDF URL
    price: 50,
  },
];

const subscriptionPriceId = "price_xxx_subscription"; // TODO: Replace with your Stripe subscription price ID

const Fitness = () => {
  const [activeProgram, setActiveProgram] = useState(null);
  const [hoveredProgramId, setHoveredProgramId] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const { user } = useAuth();

  // Placeholder: Replace with real user access logic
  const userHasAccess = (programId) => false; // TODO: Implement real access check

  // Stripe checkout for one-time purchase
  const handleStripeCheckout = async (program) => {
    if (!user) {
      toast.error("Please log in to purchase this program.");
      return;
    }
    try {
      const stripe = await stripePromise;
      // Pass image and title to backend for Stripe product data
      const data = await createCheckoutSession({
        userId: user.id,
        items: [{
          productId: program.id,
          quantity: 1,
          priceId: program.priceId,
          image: program.image, // Pass image
          name: program.title,  // Pass name
          description: program.description, // Pass description
          price: program.price, // Pass price for backend
        }],
        type: "fitness_one_time"
      });
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) toast.error("Failed to redirect to payment.");
    } catch (err) {
      toast.error("Checkout failed. Please try again later.");
    }
  };

  // Stripe checkout for subscription
  const handleStripeSubscription = async () => {
    if (!user) {
      toast.error("Please log in to subscribe.");
      return;
    }
    try {
      const stripe = await stripePromise;
      const data = await createCheckoutSession({
        userId: user.id,
        items: [{ priceId: subscriptionPriceId, quantity: 1 }],
        type: "fitness_subscription"
      });
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) toast.error("Failed to redirect to payment.");
    } catch (err) {
      toast.error("Subscription failed. Please try again later.");
    }
  };

  const handleDownloadPDF = (program) => {
    // Implement download logic (e.g., fetch PDF from backend)
    window.open(program.pdfUrl, "_blank");
  };

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
              {hoveredProgramId === program.id && (
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
            <video
              src={activeProgram.video}
              controls
              autoPlay
              style={{ width: '100%', maxWidth: 480, borderRadius: 12, margin: '20px 0' }}
            />
            <button onClick={() => setActiveProgram(null)} className="fitness-modal-close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fitness;
