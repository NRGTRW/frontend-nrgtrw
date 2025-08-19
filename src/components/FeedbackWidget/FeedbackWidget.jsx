import React, { useState } from "react";
import "./FeedbackWidget.css";

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { id: "bug", label: "Bug Report", icon: "🐛" },
    { id: "feature", label: "Feature Request", icon: "💡" },
    { id: "improvement", label: "Improvement", icon: "⚡" },
    { id: "general", label: "General Feedback", icon: "💬" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackType || !message.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: feedbackType,
          message: message.trim(),
          email: email.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFeedbackType("");
        setMessage("");
        setEmail("");
        setIsSubmitted(true);

        // Close after showing success message
        setTimeout(() => {
          setIsSubmitted(false);
          setIsOpen(false);
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setFeedbackType("");
      setMessage("");
      setEmail("");
      setIsSubmitted(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        className="feedback-widget-button"
        onClick={() => setIsOpen(true)}
        aria-label="Provide feedback"
        title="Share your feedback"
      >
        <span className="feedback-icon">💬</span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="feedback-overlay" onClick={handleClose}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="feedback-header">
              <h3>Share Your Feedback</h3>
              <button
                className="feedback-close-btn"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Close feedback form"
              >
                ×
              </button>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div className="feedback-success">
                <span className="success-icon">✅</span>
                <p>Thank you for your feedback!</p>
              </div>
            )}

            {/* Feedback Form */}
            {!isSubmitted && (
              <form onSubmit={handleSubmit} className="feedback-form">
                {/* Feedback Type Selection */}
                <div className="feedback-type-section">
                  <label>What type of feedback do you have?</label>
                  <div className="feedback-type-grid">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className={`feedback-type-btn ${feedbackType === type.id ? "selected" : ""}`}
                        onClick={() => setFeedbackType(type.id)}
                      >
                        <span className="type-icon">{type.icon}</span>
                        <span className="type-label">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="feedback-message-section">
                  <label htmlFor="feedback-message">
                    Tell us more about your{" "}
                    {feedbackType
                      ? feedbackTypes
                          .find((t) => t.id === feedbackType)
                          ?.label.toLowerCase()
                      : "feedback"}
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your feedback in detail..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Input (Optional) */}
                <div className="feedback-email-section">
                  <label htmlFor="feedback-email">
                    Email (optional - for follow-up)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="feedback-submit-btn"
                  disabled={!feedbackType || !message.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
