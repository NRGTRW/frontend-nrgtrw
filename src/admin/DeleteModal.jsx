import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/DeleteModal.css"

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-red-600">This is irreversible</h2>
        <p className="text-gray-700 mt-2">Are you sure you want to delete this product?</p>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={onConfirm}>
            DELETE
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
