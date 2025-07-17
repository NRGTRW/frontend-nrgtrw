import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const { selectedRequest, messages, sendMessage, messagesLoading } = useChatContext();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    // When selectedRequest changes, set detailsOpen based on status
    if (selectedRequest) {
      setDetailsOpen(selectedRequest.status !== 'accepted');
    }
  }, [selectedRequest]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedRequest) {
    return (
      <div className={styles.chatWindow} style={{ alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18 }}>
        Select a request to view messages
      </div>
    );
  }

  // Determine the other participant's name
  const isCurrentUserAdmin = selectedRequest.adminId === undefined ? false : (selectedRequest.adminId === selectedRequest.userId ? false : true);
  const otherName = (msg) => {
    if (msg.senderId === selectedRequest.userId) {
      return selectedRequest.user?.name || 'User';
    } else if (msg.sender?.role && (msg.sender.role === 'ADMIN' || msg.sender.role === 'ROOT_ADMIN')) {
      return msg.sender?.name || 'Admin';
    } else {
      return msg.sender?.name || 'User';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput('');
  };

  // Dropdown/collapsible for request details
  return (
    <div className={styles.chatWindow}>
      <div
        className={styles.dropdownHeader}
        onClick={() => setDetailsOpen((open) => !open)}
        style={{
          cursor: 'pointer',
          padding: '1.2rem 1.2rem 0.5rem 1.2rem',
          borderBottom: '1px solid var(--accent-primary)',
          background: 'rgba(24,21,18,0.95)',
          borderTopRightRadius: 18,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--accent-primary)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>{detailsOpen ? '▾' : '▸'}</span>
          {selectedRequest.title}
          {selectedRequest.price && (
            <span style={{ marginLeft: 12, color: '#bfa14a', fontWeight: 500, fontSize: '1.05rem' }}>
              • {selectedRequest.price} {selectedRequest.currency || ''}
            </span>
          )}
        </span>
      </div>
      <div className={detailsOpen ? `${styles.detailsDropdown} ${styles.detailsDropdownOpen}` : styles.detailsDropdown}>
        <div style={{ fontSize: '0.98rem', color: '#bfa14a', margin: '0.2rem 0', fontStyle: 'italic' }}>{selectedRequest.description}</div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.93rem', color: '#bfa14a', marginTop: 2 }}>
          <span>Status: <b style={{ color: 'var(--accent-primary)' }}>{selectedRequest.status}</b></span>
          <span>Created: {new Date(selectedRequest.createdAt).toLocaleString()}</span>
          {selectedRequest.user && (
            <span>From: <b style={{ color: 'var(--accent-primary)' }}>{selectedRequest.user.name}</b></span>
          )}
        </div>
      </div>
      {selectedRequest.status !== 'accepted' ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#bfa14a', fontWeight: 500 }}>
          Chat will be available after this request is accepted.
        </div>
      ) : (
        <>
          <div className={styles.messages}>
            {messagesLoading ? (
              <div>Loading messages...</div>
            ) : (
              <>
                {(Array.isArray(messages) ? messages : []).map(msg => (
                  <div
                    key={msg.id}
                    className={
                      msg.senderId === selectedRequest.userId
                        ? styles.messageRow
                        : `${styles.messageRow} ${styles['messageRow.admin']}`
                    }
                  >
                    <div className={styles.meta}>
                      {otherName(msg)} • {new Date(msg.createdAt).toLocaleString()}
                    </div>
                    <div
                      className={
                        msg.senderId === selectedRequest.userId
                          ? styles.bubble
                          : `${styles.bubble} ${styles['bubble.admin']}`
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <form onSubmit={handleSend} className={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
            />
          </form>
        </>
      )}
    </div>
  );
} 