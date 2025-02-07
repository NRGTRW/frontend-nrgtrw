import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/AdminDashboard.css";
import { toast } from "react-toastify";
import { getToken } from "../context/tokenUtils";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      console.log("🔍 Retrieved Token:", token);

      if (!token) {
        toast.error("⚠️ No token found. Please log in again.");
        return;
      }

      const response = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response:", response.data);

      if (response.data.success) {
        let sortedUsers = response.data.data.sort((a, b) => a.id - b.id);
        sortedUsers = sortedUsers.sort((a, b) => (a.role === "ROOT_ADMIN" ? -1 : 1));
        setUsers(sortedUsers);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("❌ Fetch Users Error:", error.response?.data || error.message);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = getToken();
      console.log("🔑 Token being sent:", token);

      if (!token) {
        toast.error("⚠️ No token found. Please log in again.");
        return;
      }

      await axios.put(
        "/api/admin/users/role",
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (error) {
      console.error("❌ Failed to update role:", error);
      toast.error(`Role update failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("🛑 Are you sure? This action is irreversible!")) return;

    try {
      const token = getToken();
      console.log("🛠 Token being sent:", token);

      if (!token) {
        toast.error("⚠️ No token found. Please log in again.");
        return;
      }

      console.log(`🗑️ Attempting to delete user ID: ${userId}`);

      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ User deleted successfully.");
      await fetchUsers();
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      toast.error(`User deletion failed: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <div className="admin-header">
          <h2 className="admin-title">User Management</h2>
        </div>

        {loading ? (
          <div className="admin-loading-container">
            <div className="admin-loading"></div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={user.role === "ROOT_ADMIN" ? "highlighted-root" : ""}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === "ROOT_ADMIN" ? (
                        <span className="root-admin-icon">⚡👑 AURA SUPREME OVERLORD 👑⚡</span>
                      ) : (
                        <select
                          className="admin-input"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      )}
                    </td>
                    <td>
                      {user.role !== "ROOT_ADMIN" && (
                        <button className="admin-btn danger" onClick={() => handleDelete(user.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
