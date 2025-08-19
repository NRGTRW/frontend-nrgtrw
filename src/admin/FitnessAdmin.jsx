import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  fetchAllFitnessPrograms,
  createFitnessProgram,
  updateFitnessProgram,
  toggleFitnessProgram,
  deleteFitnessProgram,
  bulkToggleFitnessPrograms,
  fetchProgramStats,
} from "../services/api";

// Program Form Component
const ProgramForm = ({ program, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: program?.title || "",
    description: program?.description || "",
    image: program?.image || "",
    video: program?.video || "",
    pdfUrl: program?.pdfUrl || "",
    price: program?.price || 50,
    stripePriceId: program?.stripePriceId || "",
    isActive: program?.isActive ?? true,
    waitlistMode: program?.waitlistMode ?? false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="program-form">
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter program title"
          className={errors.title ? "error" : ""}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter program description"
          rows={3}
          className={errors.description ? "error" : ""}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <label>Image URL *</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={errors.image ? "error" : ""}
        />
        {errors.image && <span className="error-message">{errors.image}</span>}
      </div>

      <div className="form-group">
        <label>Video URL (optional)</label>
        <input
          type="url"
          value={formData.video}
          onChange={(e) => handleInputChange("video", e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </div>

      <div className="form-group">
        <label>PDF URL (optional)</label>
        <input
          type="url"
          value={formData.pdfUrl}
          onChange={(e) => handleInputChange("pdfUrl", e.target.value)}
          placeholder="https://example.com/program.pdf"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              handleInputChange("price", parseFloat(e.target.value))
            }
            placeholder="50.00"
            className={errors.price ? "error" : ""}
          />
          {errors.price && (
            <span className="error-message">{errors.price}</span>
          )}
        </div>

        <div className="form-group">
          <label>Stripe Price ID</label>
          <input
            type="text"
            value={formData.stripePriceId}
            onChange={(e) => handleInputChange("stripePriceId", e.target.value)}
            placeholder="price_1234567890"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
          />
          Active Program
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.waitlistMode}
            onChange={(e) =>
              handleInputChange("waitlistMode", e.target.checked)
            }
          />
          Waitlist Mode (Show Waitlist instead of Buy)
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="save-btn">
          {program ? "Update Program" : "Create Program"}
        </button>
      </div>
    </form>
  );
};

const FitnessAdmin = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [toggleLoading, setToggleLoading] = useState({});
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [showStats, setShowStats] = useState({});
  const [programStats, setProgramStats] = useState({});

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetchAllFitnessPrograms();
      setPrograms(response);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load fitness programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (program) => {
    setEditingProgram(program);
  };

  const handleSave = async (programData) => {
    try {
      await updateFitnessProgram(editingProgram.id, programData);
      toast.success("Program updated successfully");
      setEditingProgram(null);
      fetchPrograms();
    } catch (error) {
      console.error("Error updating program:", error);
      toast.error("Failed to update program");
    }
  };

  const handleCreate = async (programData) => {
    try {
      await createFitnessProgram(programData);
      toast.success("Program created successfully");
      setShowCreateForm(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error creating program:", error);
      toast.error("Failed to create program");
    }
  };

  const handleToggleActive = async (programId, isActive) => {
    try {
      setToggleLoading((prev) => ({ ...prev, [programId]: true }));
      await toggleFitnessProgram(programId);
      toast.success(
        `Program ${isActive ? "deactivated" : "activated"} successfully`,
      );
      fetchPrograms();
    } catch (error) {
      console.error("Error toggling program:", error);
      toast.error(`Failed to ${isActive ? "deactivate" : "activate"} program`);
    } finally {
      setToggleLoading((prev) => ({ ...prev, [programId]: false }));
    }
  };

  const handleDelete = async (programId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this program? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteFitnessProgram(programId);
      toast.success("Program deleted successfully");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program");
    }
  };

  const handleBulkToggle = async (isActive) => {
    if (selectedPrograms.length === 0) {
      toast.error("Please select programs to bulk update");
      return;
    }

    try {
      await bulkToggleFitnessPrograms(selectedPrograms, isActive);
      toast.success(
        `${selectedPrograms.length} programs ${isActive ? "activated" : "deactivated"} successfully`,
      );
      setSelectedPrograms([]);
      fetchPrograms();
    } catch (error) {
      console.error("Error bulk toggling programs:", error);
      toast.error("Failed to bulk update programs");
    }
  };

  const handleSelectProgram = (programId) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId],
    );
  };

  const handleSelectAll = () => {
    if (selectedPrograms.length === programs.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programs.map((p) => p.id));
    }
  };

  const handleShowStats = async (programId) => {
    if (showStats[programId]) {
      setShowStats((prev) => ({ ...prev, [programId]: false }));
      return;
    }

    try {
      const stats = await fetchProgramStats(programId);
      setProgramStats((prev) => ({ ...prev, [programId]: stats }));
      setShowStats((prev) => ({ ...prev, [programId]: true }));
    } catch (error) {
      console.error("Error fetching program stats:", error);
      toast.error("Failed to load program statistics");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-card">
          <div className="admin-loading" style={{ margin: "50px auto" }}></div>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Loading fitness programs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <div className="admin-header">
          <h1 className="admin-title">Fitness Programs Management</h1>
          <div className="header-actions">
            {selectedPrograms.length > 0 && (
              <div className="bulk-actions">
                <button
                  className="admin-btn"
                  onClick={() => handleBulkToggle(true)}
                  style={{
                    background: "#28a745",
                    color: "white",
                    marginRight: "10px",
                  }}
                >
                  ✅ Activate Selected ({selectedPrograms.length})
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleBulkToggle(false)}
                  style={{
                    background: "#ffc107",
                    color: "black",
                    marginRight: "10px",
                  }}
                >
                  ⏸️ Deactivate Selected ({selectedPrograms.length})
                </button>
              </div>
            )}
            <button
              className="admin-btn"
              onClick={() => setShowCreateForm(true)}
              style={{ background: "#007bff", color: "white" }}
            >
              <span>➕</span>
              Create New Program
            </button>
          </div>
        </div>

        {programs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💪</div>
            <h3>No Fitness Programs Yet</h3>
            <p>Create your first fitness program to get started!</p>
            <button
              className="admin-btn"
              onClick={() => setShowCreateForm(true)}
              style={{ background: "#007bff", color: "white" }}
            >
              <span>➕</span>
              Create First Program
            </button>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedPrograms.length === programs.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program.id)}
                        onChange={() => handleSelectProgram(program.id)}
                      />
                    </td>
                    <td>{program.title}</td>
                    <td>{program.description}</td>
                    <td>${program.price}</td>
                    <td>
                      <span
                        className={`status ${program.isActive ? "active" : "inactive"}`}
                      >
                        {program.isActive ? "✅ Active" : "⏸️ Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="admin-btn"
                          onClick={() => handleShowStats(program.id)}
                          style={{
                            background: "#17a2b8",
                            color: "white",
                            marginRight: "5px",
                          }}
                        >
                          📊
                        </button>
                        <button
                          className="admin-btn"
                          onClick={() => handleEdit(program)}
                          style={{
                            background: "#ffc107",
                            color: "black",
                            marginRight: "5px",
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          className="admin-btn"
                          onClick={() =>
                            handleToggleActive(program.id, program.isActive)
                          }
                          disabled={toggleLoading[program.id]}
                          style={{
                            background: program.isActive
                              ? "#dc3545"
                              : "#28a745",
                            color: "white",
                            marginRight: "5px",
                          }}
                        >
                          {toggleLoading[program.id] ? (
                            <div className="admin-loading"></div>
                          ) : program.isActive ? (
                            "⏸️"
                          ) : (
                            "✅"
                          )}
                        </button>
                        <button
                          className="admin-btn danger"
                          onClick={() => handleDelete(program.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {programs.length > 0 && (
          <div className="bulk-select-all">
            <label className="select-checkbox">
              <input
                type="checkbox"
                checked={selectedPrograms.length === programs.length}
                onChange={handleSelectAll}
              />
              <span className="checkmark"></span>
              Select All Programs
            </label>
          </div>
        )}

        {/* Edit Modal */}
        {editingProgram && (
          <div
            className="modal-overlay"
            onClick={() => setEditingProgram(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Program</h2>
              <ProgramForm
                program={editingProgram}
                onSubmit={handleSave}
                onCancel={() => setEditingProgram(null)}
              />
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showCreateForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowCreateForm(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Program</h2>
              <ProgramForm
                onSubmit={handleCreate}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessAdmin;
