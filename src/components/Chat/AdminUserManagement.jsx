import React, { useEffect, useState } from "react";
import { getUsers, adminBlockUser } from "../../services/chatService";

export default function AdminUserManagement({ userRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (userRole === "admin" || userRole === "ADMIN") {
      setLoading(true);
      getUsers().then((data) => {
        setUsers(data);
        setLoading(false);
      });
    }
  }, [userRole]);

  const handleBlockToggle = async (user) => {
    setActionLoading(user.id);
    const newStatus = user.status === "active" ? "banned" : "active";
    await adminBlockUser(user.id, newStatus);
    setUsers((users) =>
      users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
    );
    setActionLoading(null);
  };

  if (userRole !== "admin" && userRole !== "ADMIN") return null;

  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #ffe06722",
        margin: 24,
        maxWidth: 600,
      }}
    >
      <h2 style={{ fontSize: 20, color: "#bfa600", marginBottom: 18 }}>
        User Management
      </h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}
        >
          <thead>
            <tr style={{ background: "#fffbe6", color: "#bfa600" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Name</th>
              <th style={{ textAlign: "left", padding: 8 }}>Email</th>
              <th style={{ textAlign: "left", padding: 8 }}>Role</th>
              <th style={{ textAlign: "left", padding: 8 }}>Status</th>
              <th style={{ textAlign: "left", padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  background: user.status === "banned" ? "#ffe0e0" : "#fff",
                }}
              >
                <td style={{ padding: 8 }}>{user.name}</td>
                <td style={{ padding: 8 }}>{user.email}</td>
                <td style={{ padding: 8 }}>{user.role}</td>
                <td style={{ padding: 8 }}>{user.status}</td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => handleBlockToggle(user)}
                    disabled={actionLoading === user.id}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 6,
                      border: "1.5px solid #ffe067",
                      background:
                        user.status === "banned" ? "#ffe067" : "#fafbfc",
                      color: "#bfa600",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {actionLoading === user.id
                      ? "..."
                      : user.status === "banned"
                        ? "Unblock"
                        : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
