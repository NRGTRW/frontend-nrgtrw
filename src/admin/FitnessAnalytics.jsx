import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  fetchFitnessAnalytics, 
  fetchFitnessSubscriptions, 
  cancelFitnessSubscription,
  exportFitnessPurchases,
  exportFitnessSubscriptions
} from '../services/api';


const FitnessAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, subscriptionsData] = await Promise.all([
        fetchFitnessAnalytics(),
        fetchFitnessSubscriptions()
      ]);
      setAnalytics(analyticsData);
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await cancelFitnessSubscription(subscriptionId);
      toast.success('Subscription cancelled successfully');
      fetchData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleExportPurchases = async () => {
    try {
      const blob = await exportFitnessPurchases();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitness-purchases.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Purchases exported successfully');
    } catch (error) {
      console.error('Error exporting purchases:', error);
      toast.error('Failed to export purchases');
    }
  };

  const handleExportSubscriptions = async () => {
    try {
      const blob = await exportFitnessSubscriptions();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitness-subscriptions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Subscriptions exported successfully');
    } catch (error) {
      console.error('Error exporting subscriptions:', error);
      toast.error('Failed to export subscriptions');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-card">
          <div className="admin-loading" style={{ margin: '50px auto' }}></div>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <div className="admin-header">
          <h1 className="admin-title">Fitness Analytics & Subscriptions</h1>
          <div className="export-buttons">
            <button 
              className="admin-btn" 
              onClick={handleExportPurchases}
              style={{ background: '#28a745', color: 'white', marginRight: '10px' }}
            >
              📊 Export Purchases
            </button>
            <button 
              className="admin-btn" 
              onClick={handleExportSubscriptions}
              style={{ background: '#17a2b8', color: 'white' }}
            >
              📈 Export Subscriptions
            </button>
          </div>
        </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          🔄 Subscriptions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 Recent Activity
        </button>
      </div>

      {activeTab === 'overview' && analytics && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💪</div>
              <div className="stat-content">
                <h3>{analytics.overview.totalPrograms}</h3>
                <p>Total Programs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{analytics.overview.activePrograms}</h3>
                <p>Active Programs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>${analytics.overview.totalRevenue.toFixed(2)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <h3>{analytics.overview.totalPurchases}</h3>
                <p>Total Purchases</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <h3>{analytics.overview.totalSubscriptions}</h3>
                <p>Total Subscriptions</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{analytics.overview.activeSubscriptions}</h3>
                <p>Active Subscriptions</p>
              </div>
            </div>
          </div>

          <div className="program-stats">
            <h2>Program Popularity</h2>
            <div className="program-stats-grid">
              {analytics.programStats.map((stat, index) => (
                <div key={index} className="program-stat-card">
                  <h4>{stat.program.title}</h4>
                  <p>Purchases: {stat._count.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="subscriptions-section">
          <h2>Subscription Management</h2>
          <div className="subscriptions-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Stripe Price ID</th>
                  <th>Status</th>
                  <th>Expires At</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td>{subscription.user.name}</td>
                    <td>{subscription.user.email}</td>
                    <td className="stripe-id">{subscription.stripePriceId}</td>
                    <td>
                      <span className={`status-badge ${subscription.status === 'CANCELLED' ? 'cancelled' : 'active'}`}>
                        {subscription.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>
                      {subscription.expiresAt 
                        ? new Date(subscription.expiresAt).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td>{new Date(subscription.createdAt).toLocaleDateString()}</td>
                    <td>
                      {subscription.status !== 'CANCELLED' && (
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancelSubscription(subscription.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activity' && analytics && (
        <div className="activity-section">
          <div className="activity-grid">
            <div className="activity-card">
              <h3>Recent Purchases</h3>
              <div className="activity-list">
                {analytics.recentActivity.purchases.map((purchase) => (
                  <div key={purchase.id} className="activity-item">
                    <div className="activity-icon">🛒</div>
                    <div className="activity-content">
                      <p><strong>{purchase.user.name}</strong> purchased <strong>{purchase.program.title}</strong></p>
                      <small>${purchase.amount} • {new Date(purchase.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-card">
              <h3>Recent Subscriptions</h3>
              <div className="activity-list">
                {analytics.recentActivity.subscriptions.map((subscription) => (
                  <div key={subscription.id} className="activity-item">
                    <div className="activity-icon">🔄</div>
                    <div className="activity-content">
                      <p><strong>{subscription.user.name}</strong> started subscription</p>
                      <small>{new Date(subscription.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default FitnessAnalytics; 