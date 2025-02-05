import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/AdminDashboard.css";
import "../assets/styles/admin.css";
import {toast} from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        throw new Error(response.data.error);
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/role`, { 
        userId, 
        newRole 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Corrected parentheses
        }
      });
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error(`Role update failed: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="admin-card glass">
      <div className="admin-header">
        <h2 className="admin-title">User Management</h2>
      </div>
      
      {loading ? (
        <div className="admin-loading"></div>
      ) : (
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
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="admin-input"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.role === "ROOT_ADMIN"}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="admin-btn danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
