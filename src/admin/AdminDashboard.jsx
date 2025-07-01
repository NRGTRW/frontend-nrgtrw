import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { toast } from "react-toastify";
import { getToken } from "../context/tokenUtils";
import DeleteConfirmationModal from "../components/Modals/DeleteConfirmationModal";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);

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
