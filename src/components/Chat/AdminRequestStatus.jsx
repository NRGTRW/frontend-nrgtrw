import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import { adminUpdateRequestStatus } from "../../services/chatService";

const STATUS_OPTIONS = ["pending", "approved", "rejected", "closed"];

export default function AdminRequestStatus({ userRole }) {
  const chatContext = useChatContext();
  const selectedRequest = chatContext?.selectedRequest;
  const fetchRequests = chatContext?.fetchRequests;
  const [loading, setLoading] = useState(false);

  if (!selectedRequest || (userRole !== "admin" && userRole !== "ADMIN"))
    return null;

  const handleChange = async (e) => {
    const status = e.target.value;
    setLoading(true);
    await adminUpdateRequestStatus(selectedRequest.id, status);
    await fetchRequests();
    setLoading(false);
  };

  return (
    <div
      style={{ marginLeft: 18, display: "flex", alignItems: "center", gap: 8 }}
    >
      <span style={{ fontWeight: 600, color: "#bfa600" }}>Status:</span>
      <select
        value={selectedRequest.status}
        onChange={handleChange}
        disabled={loading}
        style={{
          fontSize: 15,
          padding: "4px 10px",
          borderRadius: 6,
          border: "1.5px solid #ffe067",
          background: "#fffbe6",
          color: "#bfa600",
          fontWeight: 600,
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
