import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { toast } from "react-toastify";
import { getToken } from "../context/tokenUtils";
import DeleteConfirmationModal from "../components/Modals/DeleteConfirmationModal";
import { fetchWaitlistEntries, updateWaitlistEntry, deleteWaitlistEntry, fetchWaitlistStats } from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Waitlist state
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [waitlistStats, setWaitlistStats] = useState({});
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      const token = getToken();
      console.log("🔍 Retrieved Token in Production:", token);

      if (!token) {
        toast.error("⚠️ No token found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ API Response in Production:", response);

      if (response.data.success) {
        let sortedUsers = response.data.data.sort((a, b) => a.id - b.id);
        sortedUsers = sortedUsers.sort((a) =>
          a.role === "ROOT_ADMIN" ? -1 : 1
        );
        setUsers(sortedUsers);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error(
        "❌ Fetch Users Error in Production:",
        error.response?.data || error.message
      );
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWaitlistData();
  }, []);

  const fetchWaitlistData = async () => {
    try {
      setWaitlistLoading(true);
      const [entries, stats] = await Promise.all([
        fetchWaitlistEntries(),
        fetchWaitlistStats()
      ]);
      setWaitlistEntries(entries.waitlistEntries || []);
      setWaitlistStats(stats);
    } catch (error) {
      console.error("Error fetching waitlist data:", error);
      toast.error("Failed to fetch waitlist data");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = getToken();
      console.log("🔑 Token being sent:", token);

      if (!token) {
        toast.error("⚠️ No token found. Please log in again.");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/users/role`,
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (error) {
      console.error("❌ Failed to update role:", error);
      toast.error(
        `Role update failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      const token = getToken();
      console.log("🛠 Token being sent:", token);

      if (!token) {
        toast.error("⚠️ No token found. Please log in again.");
        return;
      }

      console.log(`🗑️ Attempting to delete user ID: ${userToDelete.id}`);

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/users/${userToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("User deleted successfully.");
      closeDeleteModal();
      await fetchUsers();
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      toast.error(
        `User deletion failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const handleWaitlistStatusChange = async (entryId, newStatus) => {
    try {
      console.log("Updating waitlist entry:", entryId, "to status:", newStatus);
      const result = await updateWaitlistEntry(entryId, { status: newStatus });
      console.log("Update result:", result);
      toast.success("Waitlist entry updated successfully");
      await fetchWaitlistData();
    } catch (error) {
      console.error("Error updating waitlist entry:", error);
      toast.error(`Failed to update waitlist entry: ${error.message}`);
    }
  };

  const handleDeleteWaitlistEntry = async (entryId) => {
    try {
      await deleteWaitlistEntry(entryId);
      toast.success("Waitlist entry deleted successfully");
      await fetchWaitlistData();
    } catch (error) {
      console.error("Error deleting waitlist entry:", error);
      toast.error("Failed to delete waitlist entry");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button 
          className={`admin-tab ${activeTab === 'waitlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('waitlist')}
        >
          📋 Waitlist Management
        </button>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
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
                    <tr
                      key={user.id}
                      className={
                        user.role === "ROOT_ADMIN" ? "highlighted-root" : ""
                      }
                    >
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.role === "ROOT_ADMIN" ? (
                          <span className="root-admin-icon">
                            ⚡👑 AURA SUPREME OVERLORD 👑⚡
                          </span>
                        ) : (
                          <select
                            className="admin-input"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>
                      <td>
                        {user.role !== "ROOT_ADMIN" && (
                          <button
                            className="admin-btn danger"
                            onClick={() => openDeleteModal(user)}
                          >
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
      )}

      {/* Waitlist Management Tab */}
      {activeTab === 'waitlist' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">Waitlist Management</h2>
          </div>

          {/* Waitlist Stats */}
          <div className="waitlist-stats">
            <div className="stat-card">
              <h3>📊 Waitlist Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{waitlistStats.totalWaiting || 0}</span>
                  <span className="stat-label">Waiting</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{waitlistStats.totalNotified || 0}</span>
                  <span className="stat-label">Notified</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{waitlistStats.totalConverted || 0}</span>
                  <span className="stat-label">Converted</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{waitlistStats.totalRemoved || 0}</span>
                  <span className="stat-label">Removed</span>
                </div>
              </div>
            </div>
            
            {/* Program-specific stats */}
            {waitlistStats.programStats && waitlistStats.programStats.length > 0 && (
              <div className="stat-card">
                <h3>📈 Program-Specific Stats</h3>
                <div className="program-stats-grid">
                  {waitlistStats.programStats.map((stat, index) => (
                    <div key={index} className="program-stat-item">
                      <span className="program-name">{stat.programTitle}</span>
                      <span className="program-count">{stat.count} waiting</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {waitlistLoading ? (
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
                    <th>Phone</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.name}</td>
                      <td>{entry.email}</td>
                      <td>{entry.phone || 'N/A'}</td>
                      <td>{entry.program?.title || 'General Waitlist'}</td>
                      <td>
                        <select
                          className="admin-input"
                          value={entry.status}
                          onChange={(e) => handleWaitlistStatusChange(entry.id, e.target.value)}
                        >
                          <option value="WAITING">Waiting</option>
                          <option value="NOTIFIED">Notified</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="REMOVED">Removed</option>
                        </select>
                      </td>
                      <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="admin-btn danger"
                          onClick={() => handleDeleteWaitlistEntry(entry.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {waitlistEntries.length === 0 && (
                <div className="no-data">
                  <p>No waitlist entries found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationModal
        showModal={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        productName={userToDelete ? userToDelete.name : ""}
      />
    </div>
  );
};

export default AdminDashboard;
