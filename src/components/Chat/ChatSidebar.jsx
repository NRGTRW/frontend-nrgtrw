import React from 'react';
import PropTypes from 'prop-types';
import { useChatContext } from '../../context/ChatContext';
import styles from './ChatSidebar.module.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function ChatSidebar({ onCreateRequest, mobileOpen = true, onClose }) {
  const { requests, selectedRequest, selectRequest, loading, fetchRequests } = useChatContext();
  const { user, authToken } = useAuth();

  // Handler for deleting a request (admin only)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/requests/${id}`,
        { headers: { Authorization: `Bearer ${authToken}` } });
      await fetchRequests(); // SWR-like update
    } catch (err) {
      alert('Failed to delete request.');
    }
  };

  // Handler for accepting/rejecting a request (admin only)
  const handleStatus = async (id, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/requests/${id}/status`, { status },
        { headers: { Authorization: `Bearer ${authToken}` } });
      await fetchRequests(); // SWR-like update
      // Find the updated request from the freshly fetched list
      setTimeout(() => {
        const updatedRequest = typeof requests === 'object' && Array.isArray(requests)
          ? requests.find(r => r.id === id)
          : null;
        if (updatedRequest) {
          selectRequest(updatedRequest);
        }
      }, 100); // slight delay to ensure state update
    } catch (err) {
      alert('Failed to update request status.');
    }
  };

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROOT_ADMIN');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        Requests
        {/* Removed the X (close) button for mobile */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className={styles.requestList}>
          {(Array.isArray(requests) ? requests : []).map(req => (
            <li
              key={req.id}
              className={
                req.id === selectedRequest?.id
                  ? `${styles.requestItem} ${styles['requestItem.selected']}`
                  : styles.requestItem
              }
              onClick={() => {
                selectRequest(req);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {req.title}
                </span>
                {isAdmin && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(req.id); }}
                      style={{ marginLeft: 8, color: '#b22222', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                      title="Delete request"
                    >
                      🗑
                    </button>
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); handleStatus(req.id, 'accepted'); }}
                          style={{ marginLeft: 4, color: '#228B22', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                          title="Accept request"
                        >
                          ✔
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className={styles.status}>{req.status}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

ChatSidebar.propTypes = {
  onCreateRequest: PropTypes.func,
  mobileOpen: PropTypes.bool,
  onClose: PropTypes.func,
}; 