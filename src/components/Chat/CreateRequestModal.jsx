import React, { useState } from "react";
import { createRequest } from "../../services/chatService";
import { useChatContext } from "../../context/ChatContext";

export default function CreateRequestModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchRequests } = useChatContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    await createRequest({
      title: title.trim(),
      description: description.trim(),
    });
    await fetchRequests();
    setLoading(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.35)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 32px #ffe06733",
          padding: "32px 28px",
          minWidth: 340,
          maxWidth: "90vw",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 18,
            fontSize: 20,
            color: "#bfa600",
          }}
        >
          New Request
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Website, App, Unique Dinner Date Setup, ..."
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1.5px solid #ffe067",
                fontSize: 15,
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project/request..."
              rows={4}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1.5px solid #ffe067",
                fontSize: 15,
                resize: "vertical",
              }}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "7px 18px",
                borderRadius: 6,
                border: "1.5px solid #eee",
                background: "#fafbfc",
                color: "#888",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "7px 18px",
                borderRadius: 6,
                border: "1.5px solid #ffe067",
                background: "#ffe067",
                color: "#181a1b",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
