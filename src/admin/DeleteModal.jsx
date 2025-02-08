import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/DeleteModal.css";
import "../assets/styles/admin.css";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h2 className="admin-modal-title">Confirm Deletion</h2>
        <p className="admin-modal-text">This action cannot be undone</p>
        <div className="admin-modal-actions">
          <button className="admin-btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="admin-btn danger" onClick={onConfirm}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteModal;
