import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { toast } from "react-toastify";
import { getToken } from "../context/tokenUtils";
import DeleteConfirmationModal from "../components/Modals/DeleteConfirmationModal";
import { fetchWaitlistEntries, updateWaitlistEntry, deleteWaitlistEntry, fetchWaitlistStats } from "../services/api";
import { getUserAccess } from '../utils/accessControl';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Waitlist state
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [waitlistStats, setWaitlistStats] = useState({});
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  
  // New state for enhanced features
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [activityLog, setActivityLog] = useState([]);
  const [dataLoading, setDataLoading] = useState({});
  const [feedback, setFeedback] = useState([]);

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

  // Enhanced data fetching functions
  const fetchAnalytics = async () => {
    setDataLoading(prev => ({ ...prev, analytics: true }));
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Set mock data for now
      setAnalytics({
        totalUsers: users.length,
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: users.filter(u => u.isVerified).length,
        newUsersThisWeek: 0,
        conversionRate: 0,
        topProducts: [],
        recentActivity: []
      });
    } finally {
      setDataLoading(prev => ({ ...prev, analytics: false }));
    }
  };

  const fetchProducts = async () => {
    setDataLoading(prev => ({ ...prev, products: true }));
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setDataLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchOrders = async () => {
    setDataLoading(prev => ({ ...prev, orders: true }));
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setDataLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchSystemHealth = async () => {
    setDataLoading(prev => ({ ...prev, system: true }));
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/health`);
      setSystemHealth(response.data);
    } catch (error) {
      console.error("Error fetching system health:", error);
      setSystemHealth({
        status: 'error',
        uptime: 'Unknown',
        database: 'Unknown',
        memory: 'Unknown'
      });
    } finally {
      setDataLoading(prev => ({ ...prev, system: false }));
    }
  };

  const fetchActivityLog = async () => {
    setDataLoading(prev => ({ ...prev, activity: true }));
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/activity-log`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivityLog(response.data || []);
    } catch (error) {
      console.error("Error fetching activity log:", error);
      setActivityLog([]);
    } finally {
      setDataLoading(prev => ({ ...prev, activity: false }));
    }
  };

  const fetchFeedback = async () => {
    setDataLoading(prev => ({ ...prev, feedback: true }));
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/feedback/admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Ensure we get the data array from the response
      const feedbackData = response.data?.data || response.data || [];
      setFeedback(Array.isArray(feedbackData) ? feedbackData : []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback([]);
    } finally {
      setDataLoading(prev => ({ ...prev, feedback: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWaitlistData();
    fetchAnalytics();
    fetchProducts();
    fetchOrders();
    fetchSystemHealth();
    fetchActivityLog();
    fetchFeedback();
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

  // Product Management Handlers
  const handleEditProduct = (productId) => {
    // Navigate to the product page with the product ID for editing
    navigate(`/product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = getToken();
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/admin/products/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product deleted successfully");
        fetchProducts(); // Refresh the products list
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleViewFeedback = (feedbackItem) => {
    toast.info(`Viewing feedback: ${feedbackItem.message}`);
    // In a real app, you'd open a modal or navigate to a detail page
  };

  const handleUpdateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const token = getToken();
      await axios.put(
        `${import.meta.env.VITE_API_URL}/feedback/admin/${feedbackId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Feedback status updated to ${newStatus}`);
      fetchFeedback(); // Refresh feedback list
    } catch (error) {
      console.error("Error updating feedback status:", error);
      toast.error(`Failed to update feedback status: ${error.message}`);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        const token = getToken();
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/feedback/admin/${feedbackId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Feedback deleted successfully");
        fetchFeedback(); // Refresh feedback list
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error(`Failed to delete feedback: ${error.message}`);
      }
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
        <button 
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🛍️ Product Management
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🛒 Order Management
        </button>
        <button 
          className={`admin-tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          ⚙️ System Health
        </button>
        <button 
          className={`admin-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📝 Activity Logs
        </button>
        <button 
          className={`admin-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Feedback
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">Analytics</h2>
          </div>
          {dataLoading.analytics ? (
            <div className="admin-loading-container">
              <div className="admin-loading"></div>
            </div>
          ) : (
            <div className="analytics-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{analytics.totalUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <p>{analytics.activeUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{analytics.totalOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>${analytics.totalRevenue || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Conversion Rate</h3>
                <p>{analytics.conversionRate || 0}%</p>
              </div>
              <div className="stat-card">
                <h3>New Users This Week</h3>
                <p>{analytics.newUsersThisWeek || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Top Products</h3>
                <ul>
                  {analytics.topProducts && analytics.topProducts.map((product, index) => (
                    <li key={index}>{product.name}: {product.count} sales</li>
                  ))}
                </ul>
              </div>
              <div className="stat-card">
                <h3>Recent Activity</h3>
                <ul>
                  {analytics.recentActivity && analytics.recentActivity.map((log, index) => (
                    <li key={index}>{log.message} ({new Date(log.timestamp).toLocaleDateString()})</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Management Tab */}
      {activeTab === 'products' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">Product Management</h2>
          </div>
          {dataLoading.products ? (
            <div className="admin-loading-container">
              <div className="admin-loading"></div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        {product.translations && product.translations.length > 0 
                          ? product.translations.find(t => t.language === 'en')?.name || 'No name'
                          : 'No name'
                        }
                      </td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.category?.name || 'No category'}</td>
                      <td>
                        <button 
                          className="admin-btn"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="admin-btn danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="no-data">
                  <p>No products found. Add new products from the product page.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Order Management Tab */}
      {activeTab === 'orders' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">Order Management</h2>
          </div>
          {dataLoading.orders ? (
            <div className="admin-loading-container">
              <div className="admin-loading"></div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>
                        {order.products && order.products.length > 0 ? (
                          <ul>
                            {order.products.map((item, index) => (
                              <li key={index}>{item.name || 'Unknown Product'} x{item.quantity || 1}</li>
                            ))}
                          </ul>
                        ) : (
                          'No products'
                        )}
                      </td>
                      <td>${order.total || 0}</td>
                      <td>{order.status || 'Pending'}</td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button className="admin-btn">View Details</button>
                        <button className="admin-btn">Update Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="no-data">
                  <p>No orders found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'system' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">System Health</h2>
          </div>
          {dataLoading.system ? (
            <div className="admin-loading-container">
              <div className="admin-loading"></div>
            </div>
          ) : (
            <div className="system-health-grid">
              <div className="stat-card">
                <h3>Status</h3>
                <p style={{ color: systemHealth.status === 'ok' ? 'green' : 'red' }}>{systemHealth.status}</p>
              </div>
              <div className="stat-card">
                <h3>Uptime</h3>
                <p>{systemHealth.uptime}</p>
              </div>
              <div className="stat-card">
                <h3>Database</h3>
                <p>{systemHealth.database}</p>
              </div>
              <div className="stat-card">
                <h3>Memory</h3>
                <p>{systemHealth.memory}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'activity' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">Activity Logs</h2>
          </div>
          {dataLoading.activity ? (
            <div className="admin-loading-container">
              <div className="admin-loading"></div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.user?.name || 'System'}</td>
                      <td>{log.action}</td>
                      <td>{log.details}</td>
                      <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activityLog.length === 0 && (
                <div className="no-data">
                  <p>No activity logs found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Feedback Management Tab */}
      {activeTab === 'feedback' && (
        <div className="admin-card">
          <div className="admin-header">
            <h2 className="admin-title">Feedback Management</h2>
          </div>
          {dataLoading.feedback ? (
            <div className="admin-loading-container">
              <div className="admin-loading"></div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(feedback) && feedback.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <span className={`feedback-type-badge ${item.type}`}>
                          {item.type === 'bug' && '🐛 Bug'}
                          {item.type === 'feature' && '💡 Feature'}
                          {item.type === 'improvement' && '⚡ Improvement'}
                          {item.type === 'general' && '💬 General'}
                        </span>
                      </td>
                      <td>
                        <div className="feedback-message">
                          {item.message.length > 100 
                            ? `${item.message.substring(0, 100)}...` 
                            : item.message
                          }
                        </div>
                      </td>
                      <td>{item.email || 'N/A'}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${item.status || 'new'}`}>
                          {item.status || 'New'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="admin-btn"
                          onClick={() => handleViewFeedback(item)}
                        >
                          View
                        </button>
                        <button 
                          className="admin-btn"
                          onClick={() => handleUpdateFeedbackStatus(item.id, 'reviewed')}
                        >
                          Mark Reviewed
                        </button>
                        <button 
                          className="admin-btn danger"
                          onClick={() => handleDeleteFeedback(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Array.isArray(feedback) && feedback.length === 0 && (
                <div className="no-data">
                  <p>No feedback found.</p>
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
