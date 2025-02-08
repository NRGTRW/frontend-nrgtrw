import React from "react";
import "../assets/styles/PublishConfirmationModal.css";

const PublishConfirmationModal = ({
  showModal,
  onClose,
  onConfirm,
  productName,
}) => {
  if (!showModal) return null;

  return (
    <div className="publish-modal-overlay">
      <div className="publish-modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Confirm Publish</h2>
        <p>
          Are you sure you're ready to publish <strong>{productName}</strong>?
        </p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="publish-btn" onClick={onConfirm}>
            Yes, Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;
