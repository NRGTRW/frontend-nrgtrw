import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import styles from "./RequestModal.module.css";
import PropTypes from "prop-types";
import { createRequest } from "../../services/chatService";
import { useChatContext } from "../../context/ChatContext";

const RequestModal = ({ isOpen, onClose, onOpenChat }) => {
  const { user } = useAuth();
  const { fetchRequests } = useChatContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    description: "",
    timeline: "",
    budget: "",
    urgency: "medium",
    additionalInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRequestId, setLastRequestId] = useState(null);

  // Auto-save to localStorage
  const saveToStorage = (data) => {
    localStorage.setItem("requestFormData", JSON.stringify(data));
  };

  const loadFromStorage = () => {
    const saved = localStorage.getItem("requestFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  };

  const clearStorage = () => {
    localStorage.removeItem("requestFormData");
  };

  // Load saved data on mount
  useEffect(() => {
    if (isOpen) {
      loadFromStorage();
    }
  }, [isOpen]);

  // Auto-save on form changes
  useEffect(() => {
    if (isOpen && Object.values(formData).some((value) => value !== "")) {
      saveToStorage(formData);
    }
  }, [formData, isOpen]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user && isOpen) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
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
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // Compose title and description for the in-app request
      const title =
        formData.projectType || formData.description.slice(0, 40) || "Request";
      const description =
        `Name: ${formData.name}\n` +
        (formData.email ? `Email: ${formData.email}\n` : "") +
        (formData.projectType
          ? `Project Type: ${formData.projectType}\n`
          : "") +
        (formData.timeline ? `Timeline: ${formData.timeline}\n` : "") +
        (formData.budget ? `Budget: ${formData.budget}\n` : "") +
        (formData.urgency ? `Urgency: ${formData.urgency}\n` : "") +
        `Description: ${formData.description}\n` +
        (formData.additionalInfo
          ? `Additional Info: ${formData.additionalInfo}`
          : "");
      const res = await createRequest({ title, description });
      if (res && !res.error) {
        toast.success("Request submitted! Awaiting admin approval.");
        setFormData({
          name: "",
          email: "",
          projectType: "",
          description: "",
          timeline: "",
          budget: "",
          urgency: "medium",
          additionalInfo: "",
        });
        clearStorage();
        setLastRequestId(res.id); // Save the request ID for chat access
        await fetchRequests(); // Refresh chat list instantly
        onClose();
        if (onOpenChat) onOpenChat(res.id);
      } else {
        toast.error(res.error || "Failed to submit request.");
      }
    } catch (error) {
      toast.error("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.requestModalOverlay} onClick={handleClose}>
      <div className={styles.requestModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.requestModalHeader}>
          <div className={styles.requestModalTitle}>
            <h2>Make a Request</h2>
            <p>Tell us what you need and we'll make it happen</p>
          </div>
          <button className={styles.requestModalClose} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.requestModalContent}>
          <div className={styles.autoSaveIndicator}>
            💾 Auto-saved - Your progress is safe!
          </div>

          <form onSubmit={handleSubmit} className={styles.requestForm}>
            <div className={styles.formSection}>
              <h3>Your Information</h3>
              <div className={styles.formRow}>
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
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>💡 Project Details</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="projectType">Project Type</label>
                  <input
                    type="text"
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    placeholder="e.g. Website, App, Unique Dinner Date Setup, Custom Gift, Consulting, ..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="timeline">Desired Timeline</label>
                  <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 weeks, ASAP, by March 1st"
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="budget">Budget Range</label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g. $500-$1000, Flexible"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="urgency">Urgency</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Project Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you want done..."
                  rows={4}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Anything else we should know?"
                  rows={2}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

RequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RequestModal;
