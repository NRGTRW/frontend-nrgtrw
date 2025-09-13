import React, { useState, useEffect } from "react";
import { joinClothingVote, checkClothingVoteStatus } from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProductVoteModal.module.css";

const ProductVoteModal = ({ isOpen, onClose, product = null }) => {
  const authContext = useAuth();
  const user = authContext?.user;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    priceRange: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [voteInfo, setVoteInfo] = useState({ position: null, total: 0 });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    } else {
      // Clear form data for non-logged-in users
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
      }));
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!product) {
      toast.error("Product is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const voteData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        categoryId: product.categoryId,
        priceRange: formData.priceRange,
        productId: product.id,
      };
      await joinClothingVote(voteData);
      // Fetch position and total after voting
      const status = await checkClothingVoteStatus(
        formData.email,
        product.categoryId,
      );
      setVoteInfo({ position: status.position, total: status.totalVotes });
      toast.success(
        `Successfully voted for ${product.name || "this product"}!`,
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        priceRange: "",
      });
      // Don't close modal immediately, show position/progress
    } catch (error) {
      if (error.message && error.message.includes("already voted")) {
        toast.warning("You have already voted for this product!");
      } else {
        toast.error("Failed to submit vote. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkExistingStatus = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email first");
      return;
    }
    if (!product) {
      toast.error("Product is required");
      return;
    }
    setIsChecking(true);
    try {
      const result = await checkClothingVoteStatus(
        formData.email,
        product.categoryId,
      );
      setVoteInfo({ position: result.position, total: result.totalVotes });
      if (result.hasVoted) {
        toast.info("You have already voted for this product!");
      } else {
        toast.info("You have not voted for this product yet.");
      }
    } catch (error) {
      toast.error("Failed to check vote status");
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  // Progress bar calculation
  const { position, total } = voteInfo;
  const progressPercent =
    position && total ? Math.round((position / total) * 100) : 0;

  return (
    <div className={styles.productVoteModalOverlay} onClick={onClose}>
      <div
        className={styles.productVoteModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.productVoteModalHeader}>
          <h2>Vote for Product</h2>
          <button className={styles.productVoteModalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.productVoteModalContent}>
          {product && (
            <div className={styles.productInfo}>
              <h3>{product.name || "Product"}</h3>
              <p>
                Show your interest in this specific product. If enough people
                vote, we'll make it happen!
              </p>
            </div>
          )}
          <div className={styles.voteDescription}>
            <p>
              🎯 <strong>Make it happen!</strong> Vote for this product and help
              us decide which pieces to produce next.
            </p>
            <p>
              📧 We'll notify you via email when we have enough interest to
              start production, and you'll get early access before anyone else.
            </p>
            {!user && (
              <p
                style={{
                  color: "var(--accent-primary)",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                💡 <strong>Tip:</strong> Log in for accurate vote tracking and
                better experience!
              </p>
            )}
          </div>

          {/* Show progress bar and position if available */}
          {position && total ? (
            <div className={styles.voteProgressSection}>
              <div className={styles.voteProgressLabel}>
                <span>
                  🎉 Your Position: <strong>{position}</strong> / {total}
                </span>
              </div>
              <div className={styles.voteProgressBarBg}>
                <div
                  className={styles.voteProgressBar}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className={styles.voteProgressText}>
                {progressPercent === 1
                  ? "You were the first to vote!"
                  : `You're in the top ${progressPercent}% of voters!`}
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className={styles.voteForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <div className={styles.emailInputGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
                <button
                  type="button"
                  className={styles.checkStatusBtn}
                  onClick={checkExistingStatus}
                  disabled={isChecking}
                >
                  {isChecking ? "Checking..." : "Check Status"}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priceRange">
                Preferred Price Range (Optional)
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
              >
                <option value="">Select a price range</option>
                <option value="under50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200plus">$200+</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Add a message (optional)"
                rows={2}
              />
            </div>

            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.voteBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Vote"}
              </button>
            </div>
          </form>

          <div className={styles.voteBenefits}>
            <h4>Why Vote?</h4>
            <ul>
              <li>Get early access to new products</li>
              <li>Help decide what we make next</li>
              <li>Receive exclusive updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVoteModal;
