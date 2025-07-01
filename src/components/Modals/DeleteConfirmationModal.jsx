import React from "react";
import "./DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({
  showModal,
  onClose,
  onConfirm,
  productName,
}) => {
  if (!showModal) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Are you sure?</h2>
        <p>
          You are about to delete <strong>{productName}</strong>. This action is
          irreversible.
        </p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
