import React, { useState } from "react";
import "./insertColorName.css"; // Adjust the path as needed

const InsertColorName = ({ show, onConfirm, onCancel }) => {
  const [colorName, setColorName] = useState("");

  if (!show) return null;

  const handleConfirm = () => {
    if (colorName.trim() === "") return; // Optionally, you could display an error message here
    onConfirm(colorName);
    setColorName("");
  };

  const handleCancel = () => {
    onCancel();
    setColorName("");
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <button className="close" onClick={handleCancel}>
          &times;
        </button>
        <h2>New Color</h2>
        <p>Please enter the new color name:</p>
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="New color name"
          className="color-input"
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsertColorName;
